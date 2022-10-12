import chai, { expect } from 'chai'
import { name } from '../src'
import { Transaction } from '../src/interface'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { pack } from '../src/helpers'
import {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction as LegacyTransaction,
  TransactionFactory
} from '@ethereumjs/tx'
import { checkEquality } from './util'
import { codecs } from '../../'

const txCodec = codecs[name]
const { assert } = chai
const test = it
const same = assert.deepStrictEqual

const accessListTxFileName = 'access_list_tx_enc'
const dynamicFeeTxFileName = 'dynamic_fee_tx_enc'
const legacyTxFileName = 'legacy_tx_enc'

describe('eth-tx', function () {
  const accessListTxFilePath = __dirname.concat('/', accessListTxFileName)
  const dynamicFeeTxFilePath = __dirname.concat('/', dynamicFeeTxFileName)
  const legacyTxFilePath = __dirname.concat('/', legacyTxFileName)
  const accessListTxRLP = fs.readFileSync(accessListTxFilePath)
  const dynamicFeeTxRLP = fs.readFileSync(dynamicFeeTxFilePath)
  const legacyTxRLP = fs.readFileSync(legacyTxFilePath)
  const accessListTx: AccessListEIP2930Transaction = <AccessListEIP2930Transaction>TransactionFactory.fromSerializedData(accessListTxRLP)
  const dynamicFeeTx: FeeMarketEIP1559Transaction = <FeeMarketEIP1559Transaction>TransactionFactory.fromSerializedData(dynamicFeeTxRLP)
  const legacyTx: LegacyTransaction = <LegacyTransaction>TransactionFactory.fromSerializedData(legacyTxRLP)
  const expectedAccessListTx: Transaction = pack(accessListTx)
  const expectedDynamicFeeTx: Transaction = pack(dynamicFeeTx)
  const expectedLegacyTx: Transaction = pack(legacyTx)

  const anyAccessListTx: any = {
    TxType: expectedAccessListTx.TxType.toString(),
    ChainID: expectedAccessListTx.ChainID,
    AccountNonce: expectedAccessListTx.AccountNonce.toString(),
    GasPrice: expectedAccessListTx.GasPrice,
    GasTipCap: expectedAccessListTx.GasTipCap,
    GasFeeCap: expectedAccessListTx.GasFeeCap,
    GasLimit: expectedAccessListTx.GasLimit.toString(),
    Recipient: expectedAccessListTx.Recipient,
    Amount: expectedAccessListTx.Amount.toString(),
    Data: expectedAccessListTx.Data.toString('hex'),
    AccessList: expectedAccessListTx.AccessList,
    V: expectedAccessListTx.V.toString(),
    R: expectedAccessListTx.R.toString(),
    S: expectedAccessListTx.S.toString()
  }
  const anyDynamicFeeTx: any = {
    TxType: expectedDynamicFeeTx.TxType.toString(),
    ChainID: expectedDynamicFeeTx.ChainID,
    AccountNonce: expectedDynamicFeeTx.AccountNonce.toString(),
    GasPrice: expectedDynamicFeeTx.GasPrice,
    GasTipCap: expectedDynamicFeeTx.GasTipCap,
    GasFeeCap: expectedDynamicFeeTx.GasFeeCap,
    GasLimit: expectedDynamicFeeTx.GasLimit.toString(),
    Recipient: expectedDynamicFeeTx.Recipient,
    Amount: expectedDynamicFeeTx.Amount.toString(),
    Data: expectedDynamicFeeTx.Data.toString('hex'),
    AccessList: expectedDynamicFeeTx.AccessList,
    V: expectedDynamicFeeTx.V.toString(),
    R: expectedDynamicFeeTx.R.toString(),
    S: expectedDynamicFeeTx.S.toString()
  }
  const anyLegacyTx: any = {
    TxType: expectedLegacyTx.TxType.toString(),
    ChainID: expectedLegacyTx.ChainID,
    AccountNonce: expectedLegacyTx.AccountNonce.toString(),
    GasPrice: expectedLegacyTx.GasPrice,
    GasTipCap: expectedLegacyTx.GasTipCap,
    GasFeeCap: expectedLegacyTx.GasFeeCap,
    GasLimit: expectedLegacyTx.GasLimit.toString(),
    Recipient: expectedLegacyTx.Recipient,
    Amount: expectedLegacyTx.Amount.toString(),
    Data: expectedLegacyTx.Data.toString('hex'),
    AccessList: expectedLegacyTx.AccessList,
    V: expectedLegacyTx.V.toString(),
    R: expectedLegacyTx.R.toString(),
    S: expectedLegacyTx.S.toString()
  }

  test('encode and decode round trip', () => {
    const accessListTxNode: Transaction = txCodec.decode(accessListTxRLP)
    same(accessListTxNode, expectedAccessListTx)
    const accessListTxNodeEnc = txCodec.encode(accessListTxNode)
    same(accessListTxNodeEnc, accessListTxRLP)

    const dynamicFeeTxNode: Transaction = txCodec.decode(dynamicFeeTxRLP)
    same(dynamicFeeTxNode, expectedDynamicFeeTx)
    const dynamicFeeTxNodeEnc = txCodec.encode(dynamicFeeTxNode)
    same(dynamicFeeTxNodeEnc, dynamicFeeTxRLP)

    const legacyTxNode: Transaction = txCodec.decode(legacyTxRLP)
    same(legacyTxNode, expectedLegacyTx)
    const legacyTxNodeEnc = txCodec.encode(legacyTxNode)
    same(legacyTxNodeEnc, legacyTxRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyAccessListTx as any)).to.throw()
    const preparedAccessListTx = prepare(anyAccessListTx)
    checkEquality(expectedAccessListTx, preparedAccessListTx)
    expect(() => validate(preparedAccessListTx)).to.not.throw()

    expect(() => validate(anyDynamicFeeTx as any)).to.throw()
    const preparedDynamicFeeTx = prepare(anyDynamicFeeTx)
    checkEquality(expectedDynamicFeeTx, preparedDynamicFeeTx)
    expect(() => validate(preparedDynamicFeeTx)).to.not.throw()

    expect(() => validate(anyLegacyTx as any)).to.throw()
    const preparedLegacyTx = prepare(anyLegacyTx)
    checkEquality(expectedLegacyTx, preparedLegacyTx)
    expect(() => validate(preparedLegacyTx)).to.not.throw()
  })
})
