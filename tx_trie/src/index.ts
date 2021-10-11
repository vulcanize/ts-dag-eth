import { TrieNode } from './interface'
import { ByteView } from 'multiformats/codecs/interface'
import { encode as trieEncode, decode as trieDecode } from '../../trie/src/index'

export const name = 'eth-tx-trie'
export const code = 0x92

export function encode (node: TrieNode): ByteView<TrieNode> {
  return trieEncode(node)
}

export function decode (bytes: ByteView<TrieNode>): TrieNode {
  return trieDecode(code, bytes) as TrieNode
}
