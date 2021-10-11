import { TrieNode } from './interface'
import { code } from './index'
import { prepare as triePrepare, validate as trieValidate } from '../../trie/src/util'

export function prepare (node: any): TrieNode {
  return triePrepare(code, node) as TrieNode
}

export function validate (node: TrieNode) {
  trieValidate(code, node)
}
