import { TrieNode } from './interface'
import { ByteView } from 'multiformats/codecs/interface'
import { encode as trieEncode, decode as trieDecode } from '../../trie/src/index'
import { CodecCode } from 'multicodec'

export const name = 'eth-receipt-log-trie'
export const code: CodecCode = 0x99

export function encode (node: TrieNode): ByteView<TrieNode> {
  return trieEncode(node)
}

export function decode (bytes: ByteView<TrieNode>): TrieNode {
  return trieDecode(code, bytes) as TrieNode
}
