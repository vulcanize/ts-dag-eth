import chai, { expect } from 'chai'
import { encode, decode } from '../src/index'
import { Transaction } from '../src/interface'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { Address } from 'ethereumjs-util'
import { pack } from '../src/helpers'
import BN from 'bn.js'
import {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction as LegacyTransaction,
  TransactionFactory
} from '@ethereumjs/tx'

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
    const accessListTxNode: Transaction = decode(accessListTxRLP)
    same(accessListTxNode, expectedAccessListTx)
    const accessListTxNodeEnc = encode(accessListTxNode)
    same(accessListTxNodeEnc, accessListTxRLP)

    const dynamicFeeTxNode: Transaction = decode(dynamicFeeTxRLP)
    same(dynamicFeeTxNode, expectedDynamicFeeTx)
    const dynamicFeeTxNodeEnc = encode(dynamicFeeTxNode)
    same(dynamicFeeTxNodeEnc, dynamicFeeTxRLP)

    const legacyTxNode: Transaction = decode(legacyTxRLP)
    same(legacyTxNode, expectedLegacyTx)
    const legacyTxNodeEnc = encode(legacyTxNode)
    same(legacyTxNodeEnc, legacyTxRLP)
  })

  test('prepare and validate', () => {
    testValidate(anyAccessListTx, expectedAccessListTx)
    testValidate(anyDynamicFeeTx, expectedDynamicFeeTx)
    testValidate(anyLegacyTx, expectedLegacyTx)
  })
})

function testValidate (anyTx: any, expectedTx: Transaction) {
  expect(() => validate(anyTx as any)).to.throw()
  const preparedAccessListTx = prepare(anyTx)
  for (const [k, v] of Object.entries(expectedTx)) {
    if (Object.prototype.hasOwnProperty.call(preparedAccessListTx, k)) {
      const actualVal = preparedAccessListTx[k as keyof Transaction]
      if (Array.isArray(v)) {
        if (Array.isArray(actualVal)) {
          assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
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
          assert.equal(v.toString(), actualVal.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type BN`)
        }
      } else {
        assert.equal(preparedAccessListTx[k as keyof Transaction], v, `actual ${k}: ${preparedAccessListTx[k as keyof Transaction]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedTx is not found in the preparedTx`)
    }
  }
  expect(() => validate(preparedAccessListTx)).to.not.throw()
}
