import { ByteView } from 'multiformats/codecs/interface'
import { BlockHeader, BlockHeaderBuffer } from '@ethereumjs/block'
import { Uncles } from './interface'
import { Header } from '../../header/src/interface'
import { pack as headerPack, unpack as headerUnpack } from '../../header/src/helpers'
import { rlp } from 'ethereumjs-util'

export const name = 'eth-block-list'
export const code = 0x91

export function encode (node: Uncles): ByteView<Uncles> {
  const uncles = new Array<BlockHeaderBuffer>(node.length)
  node.forEach((header, i) => {
    const ethHeader: BlockHeader = headerUnpack(header)
    uncles[i] = ethHeader.raw()
  })
  return rlp.encode(uncles)
}

export function decode (bytes: ByteView<Uncles>): Uncles {
  const uncles = rlp.decode(bytes) // Array<BlockHeaderBuffer>
  if (!Array.isArray(uncles)) {
    throw new Error('Invalid serialized uncles input. Must be array')
  }
  const node: Uncles = new Array<Header>(uncles.length)
  uncles.forEach((uncleBuffer, i) => {
    if (!Array.isArray(uncleBuffer)) {
      throw new Error('Invalid serialized uncles input. Each uncle must be an array')
    }
    const uncle: BlockHeader = BlockHeader.fromValuesArray(uncleBuffer)
    node[i] = headerPack(uncle)
  })
  return node
}
