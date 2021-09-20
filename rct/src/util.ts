import { CID } from 'multiformats/cid'
import { Receipt } from './interface'
import { arrayToNumber, bufferToNumber, hasOnlyProperties } from '../../util/src/util'
import BN from 'bn.js'
import { isLog, Logs } from '../../log/src/interface'
const toBuffer = require('typedarray-to-buffer')

const rctNodeProperties = ['TxType',
  'PostState', 'Status', 'CumulativeGasUsed',
  'Bloom', 'Logs', 'LogRootCID']

export function prepare (node: any): Receipt {
  let txType: number
  let postState: Buffer | undefined
  let status: number | undefined
  let cgu: BN
  let bloom: Buffer
  let logs: Logs
  let lrc: CID

  if (node.TxType == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.TxType is null/undefined')
  } else if (typeof node.TxType === 'string' || typeof node.TxType === 'bigint') {
    txType = Number(node.TxType)
  } else if (node.TxType instanceof Uint8Array) {
    txType = arrayToNumber(node.TxType)
  } else if (node.TxType instanceof Buffer) {
    txType = bufferToNumber(node.TxType)
  } else if (typeof node.TxType === 'number') {
    txType = node.TxType
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.TxType needs to be of type number')
  }

  if (!node.PostState && !node.Status) {
    throw new TypeError('Invalid eth-tx-receipt form; either node.PostState or node.Status needs to be set')
  }

  if (node.PostState === null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.PostState is null')
  } else if (typeof node.PostState === 'string') {
    postState = Buffer.from(node.PostState, 'hex')
  } else if (node.PostState instanceof Uint8Array) {
    postState = toBuffer(node.PostState)
  } else if (node.PostState instanceof Buffer || typeof node.PostState === 'undefined') {
    postState = node.PostState
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.PostState needs to be of type Buffer')
  }

  if (node.Status === null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Status is null')
  } else if (typeof node.Status === 'string' || typeof node.Status === 'bigint') {
    status = Number(node.Status)
  } else if (node.Status instanceof Uint8Array) {
    status = arrayToNumber(node.Status)
  } else if (node.Status instanceof Buffer) {
    status = bufferToNumber(node.Status)
  } else if (typeof node.Status === 'number' || typeof node.Status === 'undefined') {
    status = node.Status
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.Status needs to be of type number')
  }

  if (node.CumulativeGasUsed == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.CumulativeGasUsed is null/undefined')
  } else if (typeof node.CumulativeGasUsed === 'string' || typeof node.CumulativeGasUsed === 'number' || node.CumulativeGasUsed instanceof Uint8Array ||
    node.CumulativeGasUsed instanceof Buffer) {
    cgu = new BN(node.CumulativeGasUsed, 10)
  } else if (typeof node.CumulativeGasUsed === 'bigint') {
    cgu = new BN(node.CumulativeGasUsed.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.CumulativeGasUsed needs to be of type BN')
  }

  if (node.Bloom == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Bloom is null/undefined')
  } else if (typeof node.Bloom === 'string') {
    bloom = Buffer.from(node.Bloom, 'hex')
  } else if (node.Bloom instanceof Uint8Array) {
    bloom = toBuffer(node.Bloom)
  } else if (node.Bloom instanceof Buffer) {
    bloom = node.Bloom
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.Bloom needs to be of type Buffer')
  }

  if (node.Logs == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Bloom is null/undefined')
  } else if (Array.isArray(node.Logs)) {
    for (const log of node.Logs) {
      if (!isLog(log)) {
        throw new TypeError('Invalid eth-tx-receipt form; node.Bloom needs to be of type Logs')
      }
    }
    logs = node.Logs
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.Bloom needs to be of type Logs')
  }

  if (node.LogRootCID == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.LogRootCID is null/undefined')
  } else if (typeof node.LogRootCID === 'string') {
    lrc = CID.parse(node.LogRootCID)
  } else if (node.LogRootCID instanceof Uint8Array) {
    lrc = CID.decode(node.LogRootCID)
  } else if (node.LogRootCID instanceof Buffer) {
    lrc = CID.decode(Uint8Array.from(node.LogRootCID))
  } else if (CID.isCID(node.LogRootCID)) {
    lrc = node.LogRootCID
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.LogRootCID needs to be of type CID')
  }

  return {
    TxType: txType,
    PostState: postState,
    Status: status,
    CumulativeGasUsed: cgu,
    Bloom: bloom,
    Logs: logs,
    LogRootCID: lrc
  }
}

/*
export interface Receipt {
    TxType: number,
    PostState?: Buffer,
    Status?: number,
    CumulativeGasUsed: BN,
    Bloom: Buffer,
    Logs: Logs,
    LogRootCID: CID
}
 */
export function validate (node: Receipt) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx-receipt form')
  }

  if (!hasOnlyProperties(node, rctNodeProperties)) {
    throw new TypeError('Invalid eth-tx-receipt form (extraneous properties)')
  }

  if (node.TxType == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.TxType is null/undefined')
  } else if (typeof node.TxType !== 'number') {
    throw new TypeError('Invalid eth-tx-receipt form; node.TxType needs to be of type number')
  }

  if (node.PostState === null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.PostState is null/undefined')
  } else if (!(node.PostState instanceof Buffer) && typeof node.PostState !== 'undefined') {
    throw new TypeError('Invalid eth-tx-receipt form; node.PostState needs to be of type Buffer or undefined')
  }

  if (node.Status === null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Status is null')
  } else if (typeof node.Status !== 'number' && typeof node.Status !== 'undefined') {
    throw new TypeError('Invalid eth-tx-receipt form; node.Status needs to be of type number or undefined')
  }

  if (node.CumulativeGasUsed == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.CumulativeGasUsed is null/undefined')
  } else if (!(node.CumulativeGasUsed instanceof BN)) {
    throw new TypeError('Invalid eth-tx-receipt form; node.CumulativeGasUsed needs to be of type BN')
  }

  if (node.Bloom == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Bloom is null/undefined')
  } else if (!(node.Bloom instanceof Buffer)) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Bloom needs to be of type Buffer')
  }

  if (node.Logs == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.Logs is null/undefined')
  } else if (Array.isArray(node.Logs)) {
    for (const log of node.Logs) {
      if (!isLog(log)) {
        throw new TypeError('Invalid eth-tx-receipt form; node.Logs needs to be of type Logs')
      }
    }
  } else {
    throw new TypeError('Invalid eth-tx-receipt form; node.Logs needs to be an Array')
  }

  if (node.LogRootCID == null) {
    throw new TypeError('Invalid eth-tx-receipt form; node.LogRootCID is null/undefined')
  } else if (!CID.isCID(node.LogRootCID)) {
    throw new TypeError('Invalid eth-tx-receipt form; node.LogRootCID needs to be of type CID')
  }
}
