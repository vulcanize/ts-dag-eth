import { CID } from 'multiformats/cid'
import {
  Child,
  isTrieBranchNode,
  isTrieExtensionNode, isTrieLeafNode,
  TrieBranchNode,
  TrieExtensionNode,
  TrieLeafNode,
  TrieNode, Value
} from './interface'
import { isReceipt } from '../../rct/src/interface'
import { code as rctCode } from '../../rct_trie/src/index'
import { isTransaction } from '../../tx/src/interface'
import { code as txCode } from '../../tx_trie/src/index'
import { isAccount } from '../../state_account/src/interface'
import { code as accountCode } from '../../state_trie/src/index'
import { isLog } from '../../log/src/interface'
import { code as logCode } from '../../log_trie/src/index'
import { code as storageCode } from '../../storage_trie/src/index'
import { Nibbles } from 'merkle-patricia-tree/dist/trieNode'
import { CodecCode } from 'multicodec'
const toBuffer = require('typedarray-to-buffer')

function preparePartialPath (node: any): Nibbles {
  let partialPath: Nibbles

  if (node.PartialPath == null) {
    throw new TypeError('Invalid eth-trie-node form; node.PartialPath is null/undefined')
  } else if (typeof node.PartialPath === 'string') {
    const buf = Buffer.from(node.PartialPath, 'hex')
    partialPath = [...buf]
  } else if (node.PartialPath instanceof Uint8Array || node.PartialPath instanceof Buffer) {
    partialPath = [...node.PartialPath]
  } else if (Array.isArray(node.PartialPath) && node.PartialPath.every((item: any) => typeof item === 'number')) {
    partialPath = node.PartialPath
  } else {
    throw new TypeError('Invalid eth-trie-node form; node.PartialPath needs to be of type Nibbles')
  }

  return partialPath
}

export function prepareLeafNode (code: CodecCode, node: any): TrieLeafNode {
  let value: Value
  const partialPath = preparePartialPath(node)

  if (node.Value == null) {
    throw new TypeError('Invalid eth-trie-node leaf form; node.Value is null/undefined')
  } else if ((isLog(node.Value) && code === logCode) ||
    (isReceipt(node.Value) && code === rctCode) ||
    (isTransaction(node.Value) && code === txCode) ||
    (isAccount(node.Value) && code === accountCode) ||
    (Buffer.isBuffer(node.Value) && code === storageCode)) {
    value = node.Value
  } else if (typeof node.Value === 'string' && code === storageCode) {
    value = Buffer.from(node.Value, 'hex')
  } else if (node.Value instanceof Uint8Array && code === storageCode) {
    value = toBuffer(node.Value)
  } else {
    throw new TypeError('Invalid eth-trie-node leaf form; node.Value needs to the correct Value type for the given trie')
  }

  return {
    PartialPath: partialPath,
    Value: value
  }
}

export function prepareExtensionNode (node: any): TrieExtensionNode {
  let child: CID
  const partialPath = preparePartialPath(node)

  if (node.Child == null) {
    throw new TypeError('Invalid eth-trie-node extension form; node.Child is null/undefined')
  } else if (typeof node.Child === 'string') {
    child = CID.parse(node.Child)
  } else if (node.Child instanceof Uint8Array || node.Child instanceof Buffer) {
    child = CID.decode(node.Child)
  } else if (CID.isCID(node.Child)) {
    child = node.Child
  } else {
    throw new TypeError('Invalid eth-trie-node extension form; node.Child needs to be of type CID')
  }

  return {
    PartialPath: partialPath,
    Child: child
  }
}

function prepareBranchChild (code: CodecCode, childNode: any): Child | undefined {
  if (childNode == null) {
    return undefined
  } else if (isTrieLeafNode(childNode)) {
    return prepareLeafNode(code, childNode)
  } else if (CID.isCID(childNode)) {
    return childNode
  } else if (typeof childNode === 'string') {
    return CID.parse(childNode)
  } else if (childNode instanceof Uint8Array || childNode instanceof Buffer) {
    return CID.decode(childNode)
  } else {
    throw new TypeError('Invalid eth-trie-node branch form; node.Child needs to be of type Child or undefined')
  }
}

export function prepareBranchNode (code: CodecCode, node: any): TrieBranchNode {
  const child0 = prepareBranchChild(code, node.Child0)
  const child1 = prepareBranchChild(code, node.Child1)
  const child2 = prepareBranchChild(code, node.Child2)
  const child3 = prepareBranchChild(code, node.Child3)
  const child4 = prepareBranchChild(code, node.Child4)
  const child5 = prepareBranchChild(code, node.Child5)
  const child6 = prepareBranchChild(code, node.Child6)
  const child7 = prepareBranchChild(code, node.Child7)
  const child8 = prepareBranchChild(code, node.Child8)
  const child9 = prepareBranchChild(code, node.Child9)
  const childA = prepareBranchChild(code, node.ChildA)
  const childB = prepareBranchChild(code, node.ChildB)
  const childC = prepareBranchChild(code, node.ChildC)
  const childD = prepareBranchChild(code, node.ChildD)
  const childE = prepareBranchChild(code, node.ChildE)
  const childF = prepareBranchChild(code, node.ChildF)

  let value: Value | undefined

  if (node.Value == null) {
    value = undefined
  } else if ((isLog(node.Value) && code === logCode) ||
    (isReceipt(node.Value) && code === rctCode) ||
    (isTransaction(node.Value) && code === txCode) ||
    (isAccount(node.Value) && code === accountCode) ||
    (Buffer.isBuffer(node.Value) && code === storageCode)) {
    value = node.Value
  } else if (typeof node.Value === 'string' && code === storageCode) {
    value = Buffer.from(node.Value, 'hex')
  } else if (node.Value instanceof Uint8Array && code === storageCode) {
    value = toBuffer(node.Value)
  } else {
    throw new TypeError('Invalid eth-trie-node branch form; node.Value needs to the correct Value type for the given trie')
  }

  return {
    Child0: child0,
    Child1: child1,
    Child2: child2,
    Child3: child3,
    Child4: child4,
    Child5: child5,
    Child6: child6,
    Child7: child7,
    Child8: child8,
    Child9: child9,
    ChildA: childA,
    ChildB: childB,
    ChildC: childC,
    ChildD: childD,
    ChildE: childE,
    ChildF: childF,
    Value: value
  }
}

export function prepare (code: CodecCode, node: any): TrieNode {
  if (isTrieBranchNode(node)) {
    return prepareBranchNode(code, node)
  }
  if (isTrieExtensionNode(node)) {
    return prepareExtensionNode(node)
  }
  if (isTrieLeafNode(node)) {
    return prepareLeafNode(code, node)
  }
  throw new Error('Invalid eth-trie-node form; node is not one of the expected kinds (branch, extension, leaf)')
}

function validatePartialPath (node: TrieLeafNode | TrieExtensionNode) {
  if (node.PartialPath == null) {
    throw new TypeError('Invalid eth-trie-node form; node.PartialPath is null/undefined')
  } else if (!(Array.isArray(node.PartialPath) && node.PartialPath.every((item: any) => typeof item === 'number'))) {
    throw new TypeError('Invalid eth-trie-node form; node.PartialPath needs to be of type Nibbles')
  }
}

export function validateLeafNode (code: CodecCode, node: TrieLeafNode) {
  validatePartialPath(node)

  if (node.Value == null) {
    throw new TypeError('Invalid eth-trie-node leaf form; node.Value is null/undefined')
  } else if (!((isLog(node.Value) && code === logCode) ||
    (isReceipt(node.Value) && code === rctCode) ||
    (isTransaction(node.Value) && code === txCode) ||
    (isAccount(node.Value) && code === accountCode) ||
    (Buffer.isBuffer(node.Value) && code === storageCode))) {
    throw new TypeError('Invalid eth-trie-node leaf form; node.Value needs to the correct Value type for the given trie')
  }
}

export function validateExtensionNode (node: TrieExtensionNode) {
  validatePartialPath(node)

  if (node.Child == null) {
    throw new TypeError('Invalid eth-trie-node extension form; node.Child is null/undefined')
  } else if (!(CID.isCID(node.Child))) {
    throw new TypeError('Invalid eth-trie-node extension form; node.Child needs to be of type CID')
  }
}

function validateBranchChild (code: CodecCode, childNode: Child | undefined) {
  if (childNode === null) {
    throw new TypeError('Invalid eth-trie-node branch form; node.Child is null')
  } else if (isTrieLeafNode(childNode)) {
    validateLeafNode(code, childNode)
  } else if (!(CID.isCID(childNode) && typeof childNode !== 'undefined')) {
    throw new TypeError('Invalid eth-trie-node branch form; node.Child needs to be of type Child or undefined')
  }
}

export function validateBranchNode (code: CodecCode, node: TrieBranchNode) {
  validateBranchChild(code, node.Child0)
  validateBranchChild(code, node.Child1)
  validateBranchChild(code, node.Child2)
  validateBranchChild(code, node.Child3)
  validateBranchChild(code, node.Child4)
  validateBranchChild(code, node.Child5)
  validateBranchChild(code, node.Child6)
  validateBranchChild(code, node.Child7)
  validateBranchChild(code, node.Child8)
  validateBranchChild(code, node.Child9)
  validateBranchChild(code, node.ChildA)
  validateBranchChild(code, node.ChildB)
  validateBranchChild(code, node.ChildC)
  validateBranchChild(code, node.ChildD)
  validateBranchChild(code, node.ChildE)
  validateBranchChild(code, node.ChildF)

  if (node.Value === null) {
    throw new TypeError('Invalid eth-trie-node branch form; node.Value is null')
  } else if (!((isLog(node.Value) && code === logCode) ||
    (isReceipt(node.Value) && code === rctCode) ||
    (isTransaction(node.Value) && code === txCode) ||
    (isAccount(node.Value) && code === accountCode) ||
    (Buffer.isBuffer(node.Value) && code === storageCode) ||
    typeof node.Value !== 'undefined')) {
    throw new TypeError('Invalid eth-trie-node branch form; node.Value needs to the correct Value type for the given trie or undefined')
  }
}

export function validate (code: CodecCode, node: TrieNode) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-trie-node form')
  }

  if (isTrieBranchNode(node)) {
    validateBranchNode(code, node)
  } else if (isTrieExtensionNode(node)) {
    validateExtensionNode(node)
  } else if (isTrieLeafNode(node)) {
    validateLeafNode(code, node)
  } else {
    throw new Error('Invalid eth-trie-node form; node is not one of the expected kinds (branch, extension, leaf)')
  }
}
