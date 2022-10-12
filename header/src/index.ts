import { ByteView } from 'multiformats/codecs/interface'
import { Header } from './interface'
import { BlockHeader } from '@ethereumjs/block'
import { pack, unpack } from './helpers'
import { CodecCode } from 'multicodec'
const toBuffer = require('typedarray-to-buffer')

export const name = 'eth-block'
export const code: CodecCode = 0x90

export function encode (node: Header): ByteView<Header> {
  return unpack(node).serialize()
}

export function decode (bytes: ByteView<Header>): Header {
  const ethHeader = BlockHeader.fromRLPSerializedHeader(toBuffer(bytes))
  return pack(ethHeader)
}
