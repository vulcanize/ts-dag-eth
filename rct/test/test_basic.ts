import chai, { expect } from 'chai'
import { name } from '../src'
import { Receipt } from '../src/interface'
import * as fs from 'fs'
import { AccessListReceipt, FeeMarketReceipt, LegacyReceipt, ReceiptFactory } from '../src/types'
import { pack } from '../src/helpers'
import { checkEquality } from './util'
import { prepare, validate } from '../src/util'
import { codecs } from '../../index'

const rctCodec = codecs[name]
const { assert } = chai
const test = it
const same = assert.deepStrictEqual

const accessListRctFileName = 'access_list_rct_enc'
const dynamicFeeRctFileName = 'dynamic_fee_rct_enc'
const legacyRctFileName = 'legacy_rct_enc'

describe('eth-tx-receipt', function () {
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
    const accessListRctNode: Receipt = rctCodec.decode(accessListRctRLP)
    same(accessListRctNode, expectedAccessListRct)
    const accessListRctNodeEnc = rctCodec.encode(accessListRctNode)
    same(accessListRctNodeEnc, accessListRctRLP)

    const dynamicFeeRctNode: Receipt = rctCodec.decode(dynamicFeeRctRLP)
    same(dynamicFeeRctNode, expectedDynamicFeeRct)
    const dynamicFeeRctNodeEnc = rctCodec.encode(dynamicFeeRctNode)
    same(dynamicFeeRctNodeEnc, dynamicFeeRctRLP)

    const legacyRctNode: Receipt = rctCodec.decode(legacyRctRLP)
    same(legacyRctNode, expectedLegacyRct)
    const legacyRctNodeEnc = rctCodec.encode(legacyRctNode)
    same(legacyRctNodeEnc, legacyRctRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyAccessListRct as any)).to.throw()
    const preparedAccessListRct = prepare(anyAccessListRct)
    checkEquality(expectedAccessListRct, preparedAccessListRct)
    expect(() => validate(preparedAccessListRct)).to.not.throw()

    expect(() => validate(anyDynamicFeeRct as any)).to.throw()
    const preparedDynamicFeeRct = prepare(anyDynamicFeeRct)
    checkEquality(expectedDynamicFeeRct, preparedDynamicFeeRct)
    expect(() => validate(preparedDynamicFeeRct)).to.not.throw()

    expect(() => validate(anyLegacyRct as any)).to.throw()
    const preparedLegacyRct = prepare(anyLegacyRct)
    checkEquality(expectedLegacyRct, preparedLegacyRct)
    expect(() => validate(preparedLegacyRct)).to.not.throw()
  })
})
