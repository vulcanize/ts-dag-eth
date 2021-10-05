import { AccessListBuffer } from '@ethereumjs/tx'
import * as BN from 'bn.js'
import { Address } from 'ethereumjs-util'
import { hasOnlyProperties } from '../../util/src/util'

export interface Transaction {
    TxType: number,
    ChainID?: BN,
    AccountNonce: BN,
    GasPrice?: BN,
    GasTipCap?: BN,
    GasFeeCap?: BN,
    GasLimit: BN,
    Recipient?: Address,
    Amount: BN,
    Data: Buffer,
    AccessList?: AccessListBuffer,
    V: BN,
    R: BN,
    S: BN
}

export const txNodeProperties = ['TxType',
  'ChainID', 'AccountNonce', 'GasPrice',
  'GasTipCap', 'GasFeeCap', 'GasLimit', 'Recipient',
  'Amount', 'Data', 'AccessList', 'V', 'R', 'S']

export function isTransaction (x: any): x is Transaction {
  if ((x as Transaction).TxType === undefined) {
    return false
  }
  if ((x as Transaction).AccountNonce === undefined) {
    return false
  }
  if ((x as Transaction).GasLimit === undefined) {
    return false
  }
  if ((x as Transaction).Amount === undefined) {
    return false
  }
  if ((x as Transaction).Data === undefined) {
    return false
  }
  if ((x as Transaction).V === undefined) {
    return false
  }
  if ((x as Transaction).R === undefined) {
    return false
  }
  if ((x as Transaction).S === undefined) {
    return false
  }
  return hasOnlyProperties(x, txNodeProperties)
}
