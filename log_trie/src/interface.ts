import { CID } from 'multiformats/cid'
import { Log } from '../../log/src/interface'
import { Nibbles } from 'merkle-patricia-tree/dist/trieNode'
import { hasOnlyProperties } from '../../util/src/util'
import { extensionNodeProperties, leafNodeProperties, branchNodeProperties } from '../../trie/src/interface'

export interface TrieBranchNode {
  Child0?: Child,
  Child1?: Child,
  Child2?: Child,
  Child3?: Child,
  Child4?: Child,
  Child5?: Child,
  Child6?: Child,
  Child7?: Child,
  Child8?: Child,
  Child9?: Child,
  ChildA?: Child,
  ChildB?: Child,
  ChildC?: Child,
  ChildD?: Child,
  ChildE?: Child,
  ChildF?: Child,
  Value?: Log
}

export function isTrieBranchNode (x: any): x is TrieBranchNode {
  return hasOnlyProperties(x, branchNodeProperties)
}

export interface TrieExtensionNode {
  PartialPath: Nibbles,
  Child: CID
}

export function isTrieExtensionNode (x: any): x is TrieExtensionNode {
  if ((x as TrieExtensionNode).PartialPath === undefined) {
    return false
  }
  if ((x as TrieExtensionNode).Child === undefined) {
    return false
  }
  return hasOnlyProperties(x, extensionNodeProperties)
}

export interface TrieLeafNode {
  PartialPath: Nibbles,
  Value: Log
}

export function isTrieLeafNode (x: any): x is TrieLeafNode {
  if ((x as TrieLeafNode).PartialPath === undefined) {
    return false
  }
  if ((x as TrieLeafNode).Value === undefined) {
    return false
  }
  return hasOnlyProperties(x, leafNodeProperties)
}

export type TrieNode =
  | TrieBranchNode
  | TrieExtensionNode
  | TrieLeafNode;

export function isTrieNode (x: any): x is TrieNode {
  return isTrieBranchNode(x) || isTrieExtensionNode(x) || isTrieLeafNode(x)
}

export type Child =
  | TrieLeafNode
  | CID;

export function isChild (x: any): x is Child {
  return isTrieLeafNode(x) || CID.isCID(x)
}
