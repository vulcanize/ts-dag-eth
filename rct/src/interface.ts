import { CID } from 'multiformats/cid'
import { Logs } from '../../log/src/interface'
import * as BN from 'bn.js'
import { hasOnlyProperties } from '../../util/src/util'

export interface Receipt {
    TxType: number,
    PostState?: Buffer,
    Status?: number,
    CumulativeGasUsed: BN,
    Bloom: Buffer,
    Logs: Logs,
    LogRootCID: CID
}

export const rctNodeProperties = ['TxType',
  'PostState', 'Status', 'CumulativeGasUsed',
  'Bloom', 'Logs', 'LogRootCID']

export function isReceipt (x: any): x is Receipt {
  if ((x as Receipt).TxType === undefined) {
    return false
  }
  if ((x as Receipt).CumulativeGasUsed === undefined) {
    return false
  }
  if ((x as Receipt).Bloom === undefined) {
    return false
  }
  if ((x as Receipt).Logs === undefined) {
    return false
  }
  if ((x as Receipt).LogRootCID === undefined) {
    return false
  }
  if ((x as Receipt).Status === undefined && (x as Receipt).PostState === undefined) {
    return false
  }
  return hasOnlyProperties(x, rctNodeProperties)
}
