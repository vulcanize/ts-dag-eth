import { ByteView } from 'multiformats/codecs/interface'
import { Header } from '../src/interface'
import { BlockHeader } from '@ethereumjs/block'
import { pack, unpack } from './helpers'
const toBuffer = require('typedarray-to-buffer')

export const name = 'eth-block'
export const code = 0x90

export function encode (node: Header): ByteView<Header> {
  return unpack(node).serialize()
}

export function decode (bytes: ByteView<Header>): Header {
  const ethHeader = BlockHeader.fromRLPSerializedHeader(toBuffer(bytes))
  return pack(ethHeader)
}
