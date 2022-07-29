import chai, { expect } from 'chai'
import { encode, decode } from '../src/index'
import { LogBuffer, Log } from '../src/interface'
import { convertLogBufferToLog } from '../src/helpers'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { rlp } from 'ethereumjs-util'
import { checkEquality } from './util'

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
    checkEquality(expectedLogNode, preparedLog)
    expect(() => validate(preparedLog)).to.not.throw()
  })
})
