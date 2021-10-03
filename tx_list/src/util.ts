import { Transactions } from './interface'
import { Transaction } from '../../tx/src/interface'
import { prepare as txPrepare, validate as txValidate } from '../../tx/src/util'

export function prepare (node: any): Transactions {
  if (!Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx-list form')
  }
  const txsNode: Transactions = new Array<Transaction>(node.length)
  node.forEach((anyNode, i) => {
    txsNode[i] = txPrepare(anyNode)
  })
  return txsNode
}

export function validate (node: Transactions) {
  if (!Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx-list form')
  }
  node.forEach((txNode, _) => {
    txValidate(txNode)
  })
}
