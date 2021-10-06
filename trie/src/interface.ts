import { CID } from 'multiformats/cid'
import { isReceipt, Receipt } from '../../rct/src/interface'
import { isTransaction, Transaction } from '../../tx/src/interface'
import { Account, isAccount } from '../../state_account/src/interface'
import { isLog, Log } from '../../log/src/interface'
import { hasOnlyProperties } from '../../util/src/util'
import { Nibbles } from 'merkle-patricia-tree/dist/trieNode'

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
  Value?: Value
}

export type TrieBranchNodeValuesArray = [
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
  Buffer | Buffer[],
]

const branchNodeProperties = [
  'Child0',
  'Child1',
  'Child2',
  'Child3',
  'Child4',
  'Child5',
  'Child6',
  'Child7',
  'Child8',
  'Child9',
  'ChildA',
  'ChildB',
  'ChildC',
  'ChildD',
  'ChildE',
  'ChildF',
  'Value'
]

export function isTrieBranchNode (x: any): x is TrieBranchNode {
  return hasOnlyProperties(x, branchNodeProperties)
}

export interface TrieExtensionNode {
  PartialPath: Nibbles,
  Child: CID
}

export type TrieExtensionNodeValuesArray = [
  Buffer,
  Buffer,
]

const extensionNodeProperties = [
  'PartialPath',
  'Child'
]

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
  Value: Value
}

export type TrieLeafNodeValuesArray = [
  Buffer,
  Buffer | Buffer[],
]

const leafNodeProperties = [
  'PartialPath',
  'Value'
]

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

export type Value =
  | Receipt
  | Transaction
  | Account
  | Log
  | Buffer;

export function isValue (x: any): x is Value {
  return isReceipt(x) || isTransaction(x) || isAccount(x) || isLog(x) || Buffer.isBuffer(x)
}
