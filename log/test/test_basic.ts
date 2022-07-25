import chai, { expect } from 'chai'
import { encode, decode } from '../src/index'
import { LogBuffer, Log } from '../src/interface'
import { convertLogBufferToLog } from '../src/helpers'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { Address, rlp } from 'ethereumjs-util'

const { assert } = chai
const test = it
const same = assert.deepStrictEqual

const logRLPFileName = 'log_rlp'

describe('eth-log', function () {
  const dirname = __dirname.concat('/', logRLPFileName)
  const logRLP = fs.readFileSync(dirname)
  const logBuf = rlp.decode(logRLP)
  if (!Array.isArray(logBuf)) {
    throw new Error('output of RLP decoding a log encoding should be an array')
  }
  assert(logBuf.length === 3)
  assert(Array.isArray(logBuf[1]))
  const logBuffer: LogBuffer = [
    logBuf[0],
    logBuf[1],
    logBuf[2]
  ]
  const expectedLogNode = convertLogBufferToLog(logBuffer)
  const anyLog: any = {
    Address: expectedLogNode.Address.toString(),
    Topics: expectedLogNode.Topics,
    Data: expectedLogNode.Data.toString('hex')
  }

  test('encode and decode round trip', () => {
    const logNode: Log = decode(logRLP)
    same(logNode, expectedLogNode)
    const logEnc = encode(logNode)
    same(logEnc, logRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyLog as any)).to.throw()
    const preparedLog = prepare(anyLog)
    for (const [k, v] of Object.entries(expectedLogNode)) {
      if (Object.prototype.hasOwnProperty.call(preparedLog, k)) {
        const actualVal = preparedLog[k as keyof Log]
        if (Array.isArray(v)) {
          if (Array.isArray(actualVal)) {
            assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
            for (const [i, topic] of v.entries()) {
              assert(topic.equals(actualVal[i]), `actual Topic: ${actualVal[i]} does not equal expected: ${topic}`)
            }
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer[]`)
          }
        } else if (v instanceof Address) {
          if (actualVal instanceof Address) {
            assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Address`)
          }
        } else if (v instanceof Buffer) {
          if (actualVal instanceof Buffer) {
            assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer`)
          }
        } else {
          assert.equal(preparedLog[k as keyof Log], v, `actual ${k}: ${preparedLog[k as keyof Log]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expectedLogNode is not found in the preparedLog`)
      }
    }
    expect(() => validate(preparedLog)).to.not.throw()
  })
})
