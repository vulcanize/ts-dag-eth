import { Receipts } from './interface'
import { Receipt } from '../../rct/src/interface'
import { prepare as rctPrepare, validate as rctValidate } from '../../rct/src/util'

export function prepare (node: any): Receipts {
  if (!Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx-receipt-list form')
  }
  const rctsNode: Receipts = new Array<Receipt>(node.length)
  node.forEach((anyNode, i) => {
    rctsNode[i] = rctPrepare(anyNode)
  })
  return rctsNode
}

export function validate (node: Receipts) {
  if (!Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx-receipt-list form')
  }
  node.forEach((rctNode, _) => {
    rctValidate(rctNode)
  })
}
