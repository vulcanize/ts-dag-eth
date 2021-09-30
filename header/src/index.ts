import { ByteView } from 'multiformats/codecs/interface'
import { Header } from '../src/interface'
import { BlockHeader } from '@ethereumjs/block'
import { pack, unpack } from './helpers'

export const name = 'eth-block'
export const code = 0x90

export function encode (node: Header): ByteView<Header> {
  return unpack(node).serialize()
}

export function decode (bytes: ByteView<Header>): Header {
  const bytesBuffer = Buffer.from(bytes.valueOf())
  const ethHeader = BlockHeader.fromRLPSerializedHeader(bytesBuffer)
  return pack(ethHeader)
}
