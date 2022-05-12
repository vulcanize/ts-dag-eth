import chai, { expect } from 'chai'
import { encode, decode } from '../src/index'
import { Receipt } from '../src/interface'
import { Log } from '../../log/src/interface'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { Address } from 'ethereumjs-util'
import { AccessListReceipt, FeeMarketReceipt, LegacyReceipt, ReceiptFactory } from '../src/types'
import { pack } from '../../rct/src/helpers'
import { CID } from 'multiformats/cid'
import BN from 'bn.js'

const { assert } = chai
const test = it
const same = assert.deepStrictEqual

const accessListRctFileName = 'access_list_rct_enc'
const dynamicFeeRctFileName = 'dynamic_fee_rct_enc'
const legacyRctFileName = 'legacy_rct_enc'

describe('eth-log', function () {
  const accessListRctFilePath = __dirname.concat('/', accessListRctFileName)
  const dynamicFeeRctFilePath = __dirname.concat('/', dynamicFeeRctFileName)
  const legacyRctFilePath = __dirname.concat('/', legacyRctFileName)
  const accessListRctRLP = fs.readFileSync(accessListRctFilePath)
  const dynamicFeeRctRLP = fs.readFileSync(dynamicFeeRctFilePath)
  const legacyRctRLP = fs.readFileSync(legacyRctFilePath)
  const accessListRct: AccessListReceipt = ReceiptFactory.fromSerializedRct(accessListRctRLP)
  const dynamicFeeRct: FeeMarketReceipt = ReceiptFactory.fromSerializedRct(dynamicFeeRctRLP)
  const legacyRct: LegacyReceipt = ReceiptFactory.fromSerializedRct(legacyRctRLP)
  const expectedAccessListRct: Receipt = pack(accessListRct)
  const expectedDynamicFeeRct: Receipt = pack(dynamicFeeRct)
  const expectedLegacyRct: Receipt = pack(legacyRct)

  const anyAccessListRct: any = {
    TxType: expectedAccessListRct.TxType.toString(),
    PostState: expectedAccessListRct.PostState,
    PostStatus: expectedAccessListRct.Status,
    CumulativeGasUsed: expectedAccessListRct.CumulativeGasUsed.toString('hex'),
    Bloom: expectedAccessListRct.Bloom.toString('hex'),
    Logs: expectedAccessListRct.Logs,
    LogRootCID: expectedAccessListRct.LogRootCID.toString()
  }
  const anyDynamicFeeRct: any = {
    TxType: expectedDynamicFeeRct.TxType.toString(),
    PostState: expectedDynamicFeeRct.PostState,
    PostStatus: expectedDynamicFeeRct.Status,
    CumulativeGasUsed: expectedDynamicFeeRct.CumulativeGasUsed.toString('hex'),
    Bloom: expectedDynamicFeeRct.Bloom.toString('hex'),
    Logs: expectedDynamicFeeRct.Logs,
    LogRootCID: expectedDynamicFeeRct.LogRootCID.toString()
  }
  const anyLegacyRct: any = {
    TxType: expectedLegacyRct.TxType.toString(),
    PostState: expectedLegacyRct.PostState,
    PostStatus: expectedLegacyRct.Status,
    CumulativeGasUsed: expectedLegacyRct.CumulativeGasUsed.toString('hex'),
    Bloom: expectedLegacyRct.Bloom.toString('hex'),
    Logs: expectedLegacyRct.Logs,
    LogRootCID: expectedLegacyRct.LogRootCID.toString()
  }

  test('encode and decode round trip', () => {
    const accessListRctNode: Receipt = decode(accessListRctRLP)
    same(accessListRctNode, expectedAccessListRct)
    const accessListRctNodeEnc = encode(accessListRctNode)
    same(accessListRctNodeEnc, accessListRctRLP)

    const dynamicFeeRctNode: Receipt = decode(dynamicFeeRctRLP)
    same(dynamicFeeRctNode, expectedDynamicFeeRct)
    const dynamicFeeRctNodeEnc = encode(dynamicFeeRctNode)
    same(dynamicFeeRctNodeEnc, dynamicFeeRctRLP)

    const legacyRctNode: Receipt = decode(legacyRctRLP)
    same(legacyRctNode, expectedLegacyRct)
    const legacyRctNodeEnc = encode(legacyRctNode)
    same(legacyRctNodeEnc, legacyRctRLP)
  })

  test('prepare and validate', () => {
    testValidate(anyAccessListRct, expectedAccessListRct)
    testValidate(anyDynamicFeeRct, expectedDynamicFeeRct)
    testValidate(anyLegacyRct, expectedLegacyRct)
  })
})

function testValidate (anyRct: any, expectedRct: Receipt) {
  expect(() => validate(anyRct as any)).to.throw()
  const preparedAccessListRct = prepare(anyRct)
  for (const [k, v] of Object.entries(expectedRct)) {
    if (Object.prototype.hasOwnProperty.call(preparedAccessListRct, k)) {
      const actualVal = preparedAccessListRct[k as keyof Receipt]
      if (v instanceof CID) {
        if (actualVal instanceof CID) {
          assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type CID`)
        }
      } else if (Array.isArray(v)) {
        if (Array.isArray(actualVal)) {
          assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
          for (const [i, log] of v.entries()) {
            validateLog(actualVal[i], log)
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
      } else if (v instanceof BN) {
        if (actualVal instanceof BN) {
          assert.equal(v.toNumber(), actualVal.toNumber(), `actual ${k}: ${actualVal.toNumber()} does not equal expected: ${v.toNumber()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type BN`)
        }
      } else {
        assert.equal(preparedAccessListRct[k as keyof Receipt], v, `actual ${k}: ${preparedAccessListRct[k as keyof Receipt]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedAccessListRct is not found in the preparedAccessListRct`)
    }
  }
  expect(() => validate(preparedAccessListRct)).to.not.throw()
}

function validateLog (log: Log, expectedLog: Log) {
  for (const [k, v] of Object.entries(expectedLog)) {
    if (Object.prototype.hasOwnProperty.call(log, k)) {
      const actualVal = log[k as keyof Log]
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
        assert.equal(log[k as keyof Log], v, `actual ${k}: ${log[k as keyof Log]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedLogNode is not found in the preparedLog`)
    }
  }
}
