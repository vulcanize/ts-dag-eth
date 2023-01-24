import {
  Child, isTrieLeafNode,
  TrieBranchNode, TrieBranchNodeValuesArray,
  TrieExtensionNode,
  TrieExtensionNodeValuesArray,
  TrieLeafNode,
  TrieLeafNodeValuesArray, Value
} from './interface'
import { cidFromHash, hashFromCID } from '../../util/src/util'
import { CID } from 'multiformats/cid'
import { isReceipt } from '../../rct/src/interface'
import { isTransaction } from '../../tx/src/interface'
import { isAccount } from '../../state_account/src/interface'
import { isLog } from '../../log/src/interface'
import { encode as txEncode, decode as txDecode } from '../../tx/src/index'
import { encode as rctEncode, decode as rctDecode } from '../../rct/src/index'
import { encode as logEncode, decode as logDecode } from '../../log/src/index'
import { encode as accountEncode, decode as stateDecode } from '../../state_account/src/index'
import { code as storageTrieCode } from '../../storage_trie/src/index'
import { code as stateTrieCode } from '../../state_trie/src/index'
import { code as txTrieCode } from '../../tx_trie/src/index'
import { code as rctTrieCode } from '../../rct_trie/src/index'
import { code as logTrieCode } from '../../log_trie/src/index'
import { CodecCode } from 'multicodec'
import { bufferToNibbles, nibblesToBuffer } from 'merkle-patricia-tree/dist/util/nibbles'
import { addHexPrefix, isTerminator, removeHexPrefix } from 'merkle-patricia-tree/dist/util/hex'
const toBuffer = require('typedarray-to-buffer')

export function unpackValue (value: Value | null): Buffer | null {
  if (!(value === null)) {
    if (isTransaction(value)) {
      return toBuffer(txEncode(value))
    }
    if (isReceipt(value)) {
      return toBuffer(rctEncode(value))
    }
    if (isLog(value)) {
      return toBuffer(logEncode(value))
    }
    if (isAccount(value)) {
      return toBuffer(accountEncode(value))
    }
    if (Buffer.isBuffer(value)) {
      return value
    }
  }
  return null
}

export function unpackChild (child: Child | null): Buffer | TrieLeafNodeValuesArray | null {
  if (!(child === null)) {
    if (CID.isCID(child)) {
      return hashFromCID(child)
    }
    if (isTrieLeafNode(child)) {
      return unpackLeafNode(child)
    }
  }
  return null
}

export function unpackExtensionNode (node: TrieExtensionNode): TrieExtensionNodeValuesArray {
  const encodedPath = addHexPrefix(node.PartialPath, false) // add the prefix; no terminator to remove
  return [
    nibblesToBuffer(encodedPath), // convert the nibbles to bytes
    hashFromCID(node.Child)
  ]
}

export function unpackLeafNode (node: TrieLeafNode): TrieLeafNodeValuesArray {
  const val = unpackValue(node.Value)
  if (val == null) {
    throw Error('leaf node value cannot be null or undefined')
  } else {
    node.PartialPath.pop() // remove the terminator suffix; must do before adding prefix so length is correct
    const encodedPath = addHexPrefix(node.PartialPath, true) // add the prefix
    return [
      nibblesToBuffer(encodedPath), // convert the nibbles to bytes
      val
    ]
  }
}

export function unpackBranchNode (node: TrieBranchNode): TrieBranchNodeValuesArray {
  return [
    unpackChild(node.Child0),
    unpackChild(node.Child1),
    unpackChild(node.Child2),
    unpackChild(node.Child3),
    unpackChild(node.Child4),
    unpackChild(node.Child5),
    unpackChild(node.Child6),
    unpackChild(node.Child7),
    unpackChild(node.Child8),
    unpackChild(node.Child9),
    unpackChild(node.ChildA),
    unpackChild(node.ChildB),
    unpackChild(node.ChildC),
    unpackChild(node.ChildD),
    unpackChild(node.ChildE),
    unpackChild(node.ChildF),
    unpackValue(node.Value)
  ]
}

export function packTwoMemberNode (code: CodecCode, raw: Buffer[]): TrieLeafNode | TrieExtensionNode {
  const nibbles = bufferToNibbles(raw[0]) // convert the bytes to nibbles
  if (isTerminator(nibbles)) {
    nibbles.push(16) // add the terminator flag
    const val = packValue(code, raw[1])
    if (val == null) {
      throw Error('TrieLeafNode.Value cannot be null')
    }
    return {
      PartialPath: removeHexPrefix(nibbles), // remove the prefix
      Value: val
    }
  }
  return {
    PartialPath: removeHexPrefix(nibbles), // remove the prefix; no terminator to add
    Child: cidFromHash(code, raw[1]) // derive CID from the hash
  }
}

export function packLeafNode (code: CodecCode, raw: TrieLeafNodeValuesArray): TrieLeafNode {
  const nibbles = bufferToNibbles(raw[0]) // convert the bytes to nibbles
  if (isTerminator(nibbles)) {
    nibbles.push(16) // add the terminator flag to the end
    const val = packValue(code, raw[1])
    if (val == null) {
      throw Error('TrieLeafNode.Value cannot be null')
    }
    return {
      PartialPath: removeHexPrefix(nibbles), // remove the prefix
      Value: val
    }
  } else {
    throw new Error('node is expected to be a leaf node but partial path does not have a terminator')
  }
}

export function packValue (code: CodecCode, value: Buffer | null): Value | null {
  if (value == null) {
    return null
  }
  if (Buffer.from('').equals(value)) {
    return null
  }
  switch (code) {
    case txTrieCode: {
      return txDecode(value)
    }
    case rctTrieCode: {
      return rctDecode(value)
    }
    case logTrieCode: {
      return logDecode(value)
    }
    case stateTrieCode: {
      return stateDecode(value)
    }
    case storageTrieCode: {
      return value
    }
    default: {
      throw Error('trie packValue function expected a tx, rct, log, state, or storage trie codec')
    }
  }
}

export function packChild (code: CodecCode, raw: Buffer | TrieLeafNodeValuesArray | null): Child | null {
  if (raw == null) {
    return null
  }
  if (Array.isArray(raw)) {
    if (raw.length === 2) {
      return packLeafNode(code, raw)
    } else {
      throw new Error('leaf node child should either be a two member byte array (embedded leaf node) or raw bytes (hash of child leaf node)')
    }
  }
  if (Buffer.from('').equals(raw)) {
    return null
  }
  if (raw.length !== 32) {
    throw new Error(`leaf node child reference should be 32 bytes in length but is ${raw.length}`)
  }
  return cidFromHash(code, raw)
}

export function packBranchNode (code: CodecCode, values: TrieBranchNodeValuesArray): TrieBranchNode {
  return {
    Child0: packChild(code, values[0]),
    Child1: packChild(code, values[1]),
    Child2: packChild(code, values[2]),
    Child3: packChild(code, values[3]),
    Child4: packChild(code, values[4]),
    Child5: packChild(code, values[5]),
    Child6: packChild(code, values[6]),
    Child7: packChild(code, values[7]),
    Child8: packChild(code, values[8]),
    Child9: packChild(code, values[9]),
    ChildA: packChild(code, values[10]),
    ChildB: packChild(code, values[11]),
    ChildC: packChild(code, values[12]),
    ChildD: packChild(code, values[13]),
    ChildE: packChild(code, values[14]),
    ChildF: packChild(code, values[15]),
    Value: packValue(code, values[16])
  }
}
