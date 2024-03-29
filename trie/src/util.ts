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
import { decode as decodeLog } from '../../log/src/index'
import { decode as decodeRct } from '../../rct/src/index'
import { decode as decodeTx } from '../../tx/src/index'
import { validate as validateLog } from '../../log/src/util'
import { validate as validateRct } from '../../rct/src/util'
import { validate as validateTx } from '../../tx/src/util'
import { validate as validateAccount } from '../../state_account/src/util'
import { decode as decodeAccount } from '../../state_account/src/index'
import { Nibbles } from 'merkle-patricia-tree/dist/trieNode'
import { CodecCode } from 'multicodec'
import {
  compactToHex,
  bufferToNibbles,
  cidFromHash,
  compactStrToNibbles,
  nibblesStrToNibbles,
  stringListToNibbles
} from '../../util/src/util'
import { isTerminator, removeHexPrefix } from 'merkle-patricia-tree/dist/util/hex'
const toBuffer = require('typedarray-to-buffer')

// This expects PartialPath to already be in the decompacted Nibble representation
// it is only managing the type conversion
function preparePartialPath (node: any): Nibbles {
  let partialPath: Nibbles

  if (node.PartialPath == null) {
    throw new TypeError('Invalid eth-trie-node form; node.PartialPath is null/undefined')
  } else if (typeof node.PartialPath === 'string') {
    if (node.PartialPath.includes(',')) { // we assume it is a comma delineated list of the decompacted key
      partialPath = stringListToNibbles(node.PartialPath)
    } else {
      if (node.PartialPath > 33) { // it must already be decompacted
        partialPath = nibblesStrToNibbles(node.PartialPath)
      } else { // it could be compacted or just a short decompacted partial path... we assume it is compact format
        partialPath = compactStrToNibbles(node.PartialPath)
        if (isTerminator(partialPath)) {
          partialPath.push(16)
        }
        partialPath = removeHexPrefix(partialPath)
      }
    }
  } else if (node.PartialPath instanceof Uint8Array || node.PartialPath instanceof Buffer) {
    if (node.PartialPath.length > 33) { // unless array is longer than 33 bytes we assume it is still in compact format
      partialPath = [...node.PartialPath]
    } else {
      partialPath = bufferToNibbles(node.PartialPath)
      if (isTerminator(partialPath)) {
        partialPath.push(16)
      }
      partialPath = removeHexPrefix(partialPath)
    }
  } else if (Array.isArray(node.PartialPath) && node.PartialPath.every((item: any) => typeof item === 'number')) {
    partialPath = node.PartialPath
  } else {
    throw new TypeError('Invalid eth-trie-node form; node.PartialPath needs to be of type Nibbles')
  }

  return partialPath
}

export function prepareLeafNode (code: CodecCode, node: any): TrieLeafNode {
  const partialPath = preparePartialPath(node)
  const value = prepareValue(code, node)
  if (value == null) {
    throw Error('TrieLeafNode cannot have null value')
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

function prepareBranchChild (code: CodecCode, childNode: any): Child | null {
  if (childNode == null) { // should we attempt to prepare embedded children that are still encoded as raw Buffer or []Buffer
    return null
  } else if (Array.isArray(childNode) && (childNode.length === 2)) {
    return prepareLeafNode(code, {
      PartialPath: childNode[0],
      Value: childNode[1]
    })
  } else if (isTrieLeafNode(childNode)) {
    return prepareLeafNode(code, childNode)
  } else if (CID.isCID(childNode)) {
    return childNode
  } else if (typeof childNode === 'string') {
    if (childNode === '') {
      return null
    }
    return CID.parse(childNode)
  } else if (childNode instanceof Uint8Array || childNode instanceof Buffer) {
    if (Buffer.from('').equals(childNode)) {
      return null
    }
    return cidFromHash(code, Buffer.from(childNode))
  } else {
    throw new TypeError('Invalid eth-trie-node branch form; node.Child needs to be of type Child or null')
  }
}

export function prepareBranchNode (code: CodecCode, node: any): TrieBranchNode {
  const child0: Child | null = prepareBranchChild(code, node.Child0)
  const child1: Child | null = prepareBranchChild(code, node.Child1)
  const child2: Child | null = prepareBranchChild(code, node.Child2)
  const child3: Child | null = prepareBranchChild(code, node.Child3)
  const child4: Child | null = prepareBranchChild(code, node.Child4)
  const child5: Child | null = prepareBranchChild(code, node.Child5)
  const child6: Child | null = prepareBranchChild(code, node.Child6)
  const child7: Child | null = prepareBranchChild(code, node.Child7)
  const child8: Child | null = prepareBranchChild(code, node.Child8)
  const child9: Child | null = prepareBranchChild(code, node.Child9)
  const childA: Child | null = prepareBranchChild(code, node.ChildA)
  const childB: Child | null = prepareBranchChild(code, node.ChildB)
  const childC: Child | null = prepareBranchChild(code, node.ChildC)
  const childD: Child | null = prepareBranchChild(code, node.ChildD)
  const childE: Child | null = prepareBranchChild(code, node.ChildE)
  const childF: Child | null = prepareBranchChild(code, node.ChildF)

  const value = prepareValue(code, node)

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

export function prepareValue (code: CodecCode, node: any): Value | null {
  let value: Value | null

  if (node.Value == null) {
    throw new TypeError('Invalid eth-trie-node leaf form; node.Value is null/undefined')
  }
  if ((node.Value instanceof Uint8Array || node.Value instanceof Buffer) && (Buffer.from('').equals(node.Value))) {
    return null
  }

  switch (code) {
    case logCode: {
      if (isLog(node.Value)) {
        value = node.Value
        break
      } else if (node.Value instanceof Uint8Array || node.Value instanceof Buffer) {
        value = decodeLog(node.Value)
        break
      } else {
        throw Error('log codec code provided but value is not a Log')
      }
    }
    case rctCode:
      if (isReceipt(node.Value)) {
        value = node.Value
        break
      } else if (node.Value instanceof Uint8Array || node.Value instanceof Buffer) {
        value = decodeRct(node.Value)
        break
      } else {
        throw Error('rct codec code provided but value is not a Receipt')
      }
    case txCode:
      if (isTransaction(node.Value)) {
        value = node.Value
        break
      } else if (node.Value instanceof Uint8Array || node.Value instanceof Buffer) {
        value = decodeTx(node.Value)
        break
      } else {
        throw Error('tx codec code provided but value is not a Transaction')
      }
    case accountCode:
      if (isAccount(node.Value)) {
        value = node.Value
        break
      } else if (node.Value instanceof Uint8Array || node.Value instanceof Buffer) {
        value = decodeAccount(node.Value)
        break
      } else {
        throw Error('account codec code provided but value is not a Account')
      }
    case storageCode:
      if (Buffer.isBuffer(node.Value)) {
        value = node.Value
        break
      } else if (node.Value instanceof Uint8Array ||
        (Array.isArray(node.Value) && node.Value.every((item: any) => typeof item === 'number'))) {
        value = toBuffer(node.Value)
        break
      } else if (typeof node.Value === 'string') {
        value = Buffer.from(node.Value, 'hex')
        break
      } else {
        throw Error('storage codec code provided but value is not a raw storage value')
      }
    default:
      throw new TypeError(`Unrecognized codec code ${code}`)
  }
  return value
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

function validateBranchChild (code: CodecCode, childNode: Child | null) {
  if (childNode != null) {
    if (isTrieLeafNode(childNode)) {
      validateLeafNode(code, childNode)
    } else if (!CID.isCID(childNode)) {
      throw new TypeError('Invalid eth-trie-node branch form; node.Child needs to be of type Child or null')
    }
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

  if ((node.Value == null) || ((node.Value instanceof Uint8Array || node.Value instanceof Buffer) && (Buffer.from('').equals(node.Value)))) {

  } else if (isLog(node.Value) && code === logCode) {
    validateLog(node.Value)
  } else if (isReceipt(node.Value) && code === rctCode) {
    validateRct(node.Value)
  } else if (isTransaction(node.Value) && code === txCode) {
    validateTx(node.Value)
  } else if (isAccount(node.Value) && code === accountCode) {
    validateAccount(node.Value)
  } else if (Buffer.isBuffer(node.Value) && code === storageCode) {

  } else {
    throw new TypeError(`Invalid eth-trie-node branch form; node.Value needs to the correct Value type for the given trie (codec: ${code}) or null`)
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
