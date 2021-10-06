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
import { encode as txEncode } from '../../tx/src/index'
import { encode as rctEncode } from '../../rct/src/index'
import { encode as logEncode } from '../../log/src/index'
import { encode as accountEncode } from '../../state_account/src/index'
import { CodecCode } from 'multicodec'
import { bufferToNibbles, nibblesToBuffer } from 'merkle-patricia-tree/dist/util/nibbles'
import { addHexPrefix, isTerminator, removeHexPrefix } from 'merkle-patricia-tree/dist/util/hex'
const toBuffer = require('typedarray-to-buffer')

export function packValue (value: Value | undefined): Buffer {
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
  return Buffer.from('')
}

export function packChild (child: Child | undefined): Buffer | Buffer[] {
  if (CID.isCID(child)) {
    return hashFromCID(child)
  }
  if (isTrieLeafNode(child)) {
    return [nibblesToBuffer(child.PartialPath), packValue(child.Value)]
  }
  return Buffer.from('')
}

export function packExtensionNode (node: TrieExtensionNode): TrieExtensionNodeValuesArray {
  const encodedPath = addHexPrefix(node.PartialPath, false) // add the prefix; no terminator to remove
  return [
    nibblesToBuffer(encodedPath), // convert the nibbles to bytes
    hashFromCID(node.Child)
  ]
}

export function packLeafNode (node: TrieLeafNode): TrieLeafNodeValuesArray {
  const encodedPath = addHexPrefix(node.PartialPath, true) // add the prefix
  encodedPath.pop() // remove the terminator suffix
  return [
    nibblesToBuffer(encodedPath), // convert the nibbles to bytes
    packValue(node.Value)
  ]
}

export function packBranchNode (node: TrieBranchNode): TrieBranchNodeValuesArray {
  return [
    packChild(node.Child0),
    packChild(node.Child1),
    packChild(node.Child2),
    packChild(node.Child3),
    packChild(node.Child4),
    packChild(node.Child5),
    packChild(node.Child6),
    packChild(node.Child7),
    packChild(node.Child8),
    packChild(node.Child9),
    packChild(node.ChildA),
    packChild(node.ChildB),
    packChild(node.ChildC),
    packChild(node.ChildD),
    packChild(node.ChildE),
    packChild(node.ChildF),
    packValue(node.Value)
  ]
}

export function unpackTwoMemberNode (code: CodecCode, raw: Buffer[]): TrieLeafNode | TrieExtensionNode {
  const nibbles = bufferToNibbles(raw[0]) // convert the bytes to nibbles
  if (isTerminator(nibbles)) {
    nibbles.push(16) // add the terminator flag
    return {
      PartialPath: removeHexPrefix(nibbles), // remove the prefix
      Value: raw[1]
    }
  }
  return {
    PartialPath: removeHexPrefix(nibbles), // remove the prefix; no terminator to add
    Child: cidFromHash(code, raw[1]) // derive CID from the hash
  }
}

export function unpackLeafNode (raw: Buffer[]): TrieLeafNode {
  const nibbles = bufferToNibbles(raw[0]) // convert the bytes to nibbles
  if (isTerminator(nibbles)) {
    nibbles.push(16) // add the terminator flag to the end
    return {
      PartialPath: removeHexPrefix(nibbles), // remove the prefix
      Value: raw[1]
    }
  } else {
    throw new Error('node is expected to be a leaf node')
  }
}

export function unpackChild (code: CodecCode, raw: Buffer): Child | undefined {
  if (Array.isArray(raw)) {
    if (raw.length === 2) {
      return unpackLeafNode(raw)
    } else {
      throw new Error('leaf node child should be a two member array')
    }
  }
  if (Buffer.compare(raw, Buffer.from(''))) {
    return undefined
  }
  return cidFromHash(code, raw)
}

export function unpackBranchNode (code: CodecCode, values: Buffer[]): TrieBranchNode {
  return {
    Child0: unpackChild(code, values[0]),
    Child1: unpackChild(code, values[1]),
    Child2: unpackChild(code, values[2]),
    Child3: unpackChild(code, values[3]),
    Child4: unpackChild(code, values[4]),
    Child5: unpackChild(code, values[5]),
    Child6: unpackChild(code, values[6]),
    Child7: unpackChild(code, values[7]),
    Child8: unpackChild(code, values[8]),
    Child9: unpackChild(code, values[9]),
    ChildA: unpackChild(code, values[10]),
    ChildB: unpackChild(code, values[11]),
    ChildC: unpackChild(code, values[12]),
    ChildD: unpackChild(code, values[13]),
    ChildE: unpackChild(code, values[14]),
    ChildF: unpackChild(code, values[15]),
    Value: packValue(values[16])
  }
}
