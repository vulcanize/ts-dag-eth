import { Uncles } from './interface'
import { BlockHeader } from '@ethereumjs/block'
import { pack as packHeader, unpack as unpackHeader } from '../../header/src/helpers'
import { Header } from '../../header/src/interface'
import { validate } from '../../header/src/util'

export function unpack (node: Uncles): BlockHeader[] {
  const uncles: BlockHeader[] = new Array<BlockHeader>(node.length)
  node.forEach((uncleNode, i) => {
    validate(uncleNode)
    uncles[i] = unpackHeader(uncleNode)
  })
  return uncles
}

export function pack (uncles: BlockHeader[]): Uncles {
  const uncleNode: Uncles = new Array<Header>(uncles.length)
  uncles.forEach((uncle, i) => {
    uncleNode[i] = packHeader(uncle)
  })
  return uncleNode
}
