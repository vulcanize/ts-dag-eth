import { Uncles } from './interface'
import { Header } from '../../header/src/interface'
import { prepare as headerPrepare, validate as headerValidate } from '../../header/src/util'

export function prepare (node: any): Uncles {
  if (!Array.isArray(node)) {
    throw new TypeError('Invalid eth-block-list form')
  }
  const unclesNode: Uncles = new Array<Header>(node.length)
  node.forEach((anyNode, i) => {
    unclesNode[i] = headerPrepare(anyNode)
  })
  return unclesNode
}

export function validate (node: Uncles) {
  if (!Array.isArray(node)) {
    throw new TypeError('Invalid eth-block-list form')
  }
  node.forEach((headerNode, _) => {
    headerValidate(headerNode)
  })
}
