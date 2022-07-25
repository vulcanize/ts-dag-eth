import { CID } from 'multiformats/cid'
import { Receipt } from '../../rct/src/interface'
import { Nibbles } from 'merkle-patricia-tree/dist/trieNode'
import { hasOnlyProperties } from '../../util/src/util'
import { extensionNodeProperties, leafNodeProperties, branchNodeProperties } from '../../trie/src/interface'

export interface TrieBranchNode {
  Child0: Child | null,
  Child1: Child | null,
  Child2: Child | null,
  Child3: Child | null,
  Child4: Child | null,
  Child5: Child | null,
  Child6: Child | null,
  Child7: Child | null,
  Child8: Child | null,
  Child9: Child | null,
  ChildA: Child | null,
  ChildB: Child | null,
  ChildC: Child | null,
  ChildD: Child | null,
  ChildE: Child | null,
  ChildF: Child | null,
  Value: Receipt | null
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
  Value: Receipt
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
