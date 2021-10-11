import { CID } from 'multiformats/cid'
import * as BN from 'bn.js'
import { Address } from 'ethereumjs-util'
import { hasOnlyProperties } from '../../util/src/util'

export interface Header {
    ParentCID: CID,
    UnclesCID: CID,
    Coinbase: Address,
    StateRootCID: CID,
    TxRootCID: CID,
    RctRootCID: CID,
    Bloom: Buffer,
    Difficulty: BN,
    Number: BN,
    GasLimit: BN,
    GasUsed: BN,
    Time: BN,
    Extra: Buffer,
    MixDigest: Buffer,
    Nonce: Buffer,
    BaseFee?: BN
}

export const headerNodeProperties = ['ParentCID',
  'UnclesCID', 'Coinbase', 'StateRootCID',
  'TxRootCID', 'RctRootCID', 'Bloom', 'Difficulty',
  'Number', 'GasLimit', 'GasUsed', 'Time', 'Extra',
  'MixDigest', 'Nonce', 'BaseFee']

export function isHeader (x: any): x is Header {
  if ((x as Header).ParentCID === undefined) {
    return false
  }
  if ((x as Header).UnclesCID === undefined) {
    return false
  }
  if ((x as Header).Coinbase === undefined) {
    return false
  }
  if ((x as Header).StateRootCID === undefined) {
    return false
  }
  if ((x as Header).TxRootCID === undefined) {
    return false
  }
  if ((x as Header).RctRootCID === undefined) {
    return false
  }
  if ((x as Header).Bloom === undefined) {
    return false
  }
  if ((x as Header).Difficulty === undefined) {
    return false
  }
  if ((x as Header).Number === undefined) {
    return false
  }
  if ((x as Header).GasLimit === undefined) {
    return false
  }
  if ((x as Header).GasUsed === undefined) {
    return false
  }
  if ((x as Header).Time === undefined) {
    return false
  }
  if ((x as Header).Extra === undefined) {
    return false
  }
  if ((x as Header).MixDigest === undefined) {
    return false
  }
  if ((x as Header).Nonce === undefined) {
    return false
  }
  return hasOnlyProperties(x, headerNodeProperties)
}
