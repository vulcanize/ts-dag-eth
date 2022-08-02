import { TrieNode } from './interface'
import { ByteView } from 'multiformats/codecs/interface'
import { encode as trieEncode, decode as trieDecode } from '../../trie/src/index'
import { CodecCode } from 'multicodec'

export const name = 'eth-storage-trie'
export const code: CodecCode = 0x98

export function encode (node: TrieNode): ByteView<TrieNode> {
  return trieEncode(node)
}

export function decode (bytes: ByteView<TrieNode>): TrieNode {
  return trieDecode(code, bytes) as TrieNode
}
