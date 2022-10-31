import { assert, expect } from 'chai'
import { encode, decode } from '../src'
import {
  isTrieExtensionNode,
  isTrieBranchNode,
  isTrieLeafNode,
  TrieBranchNode,
  TrieExtensionNode,
  TrieLeafNode,
  TrieNode
} from '../src/interface'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { packBranchNode, packTwoMemberNode } from '../src/helpers'
import { code } from '../../storage_trie/src/'
import { addHexPrefix } from 'merkle-patricia-tree/dist/util/hex'
import { rlp } from 'ethereumjs-util'
import { CID } from 'multiformats/cid'
import { nibblesToBuffer } from '../../util/src/util'

const test = it
const same = assert.deepStrictEqual

const extensionNodeFileName = 'extension_node_rlp'
const storageLeafFileName = 'storage_leaf_node_rlp'
const branchNodeFileName = 'branch_node_rlp'

describe('eth-trie', function () {
  const extensionNodeFilePath = __dirname.concat('/', extensionNodeFileName)
  const branchNodeFilePath = __dirname.concat('/', branchNodeFileName)
  const storageLeafFilePath = __dirname.concat('/', storageLeafFileName)
  const extensionNodeRLP = fs.readFileSync(extensionNodeFilePath)
  const branchNodeRLP = fs.readFileSync(branchNodeFilePath)
  const leafNodeRLP = fs.readFileSync(storageLeafFilePath)

  const extensionNodeBuffer = rlp.decode(extensionNodeRLP)
  assert.isTrue(Array.isArray(extensionNodeBuffer), 'extension node buffer is not an array')
  assert(extensionNodeBuffer.length === 2)
  const expectedExtension = packTwoMemberNode(code, extensionNodeBuffer as any)
  assert.isTrue(isTrieExtensionNode(expectedExtension), 'expected extension node does not satisfy extension node interface')
  const expectedExtensionNode = <TrieExtensionNode>expectedExtension
  const nodePathCopy = Object.assign([], expectedExtensionNode.PartialPath)
  const prefixedPath = addHexPrefix(nodePathCopy, false)
  const anyExtensionNode: any = {
    PartialPath: nibblesToBuffer(prefixedPath),
    Child: expectedExtensionNode.Child.toString()
  }

  const leafNodeBuffer = rlp.decode(leafNodeRLP)
  assert(Array.isArray(leafNodeBuffer), 'leaf node buffer is not an array')
  assert(leafNodeBuffer.length === 2)
  const expectedLeaf = packTwoMemberNode(code, leafNodeBuffer as any)
  assert(isTrieLeafNode(expectedLeaf), 'expected leaf node does not satisfy leaf node interface')
  const expectedLeafNode = <TrieLeafNode>expectedLeaf
  const anyLeafNode: any = {
    PartialPath: expectedLeafNode.PartialPath.toString(),
    Value: expectedLeafNode.Value
  }

  const branchNodeBuffer = rlp.decode(branchNodeRLP)
  assert(Array.isArray(branchNodeBuffer), 'branch node buffer is not an array')
  assert(branchNodeBuffer.length === 17)
  const expectedBranchNode = packBranchNode(code, branchNodeBuffer as any)
  assert(isTrieBranchNode(expectedBranchNode), 'expected branch node does not satisfy branch node interface')
  const anyBranchNode: any = {
    Child0: branchNodeBuffer[0],
    Child1: branchNodeBuffer[1],
    Child2: branchNodeBuffer[2],
    Child3: branchNodeBuffer[3],
    Child4: branchNodeBuffer[4],
    Child5: branchNodeBuffer[5],
    Child6: branchNodeBuffer[6],
    Child7: branchNodeBuffer[7],
    Child8: branchNodeBuffer[8],
    Child9: branchNodeBuffer[9],
    ChildA: branchNodeBuffer[10],
    ChildB: branchNodeBuffer[11],
    ChildC: branchNodeBuffer[12],
    ChildD: branchNodeBuffer[13],
    ChildE: branchNodeBuffer[14],
    ChildF: branchNodeBuffer[15],
    Value: branchNodeBuffer[16]
  }

  test('encode and decode round trip', () => {
    const extensionNode: TrieNode = decode(code, extensionNodeRLP)
    same(extensionNode, expectedExtensionNode)
    const extensionNodeEnc = encode(extensionNode)
    same(extensionNodeEnc, extensionNodeRLP)

    const leafNode: TrieNode = decode(code, leafNodeRLP)
    same(leafNode, expectedLeaf)
    const leafNodeEnc = encode(leafNode)
    same(leafNodeEnc, leafNodeRLP)

    const branchNode: TrieNode = decode(code, branchNodeRLP)
    same(branchNode, expectedBranchNode)
    const branchNodeEnc = encode(branchNode)
    same(branchNodeEnc, branchNodeRLP)
  })

  test('prepare and validate', () => {
    testValidate(anyBranchNode, expectedBranchNode)
    testValidate(anyLeafNode, expectedLeafNode)
    testValidate(anyExtensionNode, expectedExtensionNode)
  })
})

function testValidate (anyTrieNode: any, expectedTrieNode: TrieNode) {
  expect(() => validate(code, anyTrieNode as any)).to.throw()
  const preparedTrieNode = prepare(code, anyTrieNode)
  if (isTrieBranchNode(preparedTrieNode)) {
    for (const [k, v] of Object.entries(expectedTrieNode)) {
      if (Object.prototype.hasOwnProperty.call(preparedTrieNode, k)) {
        const actualVal = preparedTrieNode[k as keyof TrieBranchNode]
        if (Array.isArray(v)) {
          if (Array.isArray(actualVal)) {
            assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer[]`)
          }
        } else if (v instanceof CID) {
          if (actualVal instanceof CID) {
            assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type CID`)
          }
        } else if (v instanceof Buffer) {
          if (actualVal instanceof Buffer) {
            assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer`)
          }
        } else {
          assert.equal(preparedTrieNode[k as keyof TrieBranchNode], v, `actual ${k}: ${preparedTrieNode[k as keyof TrieBranchNode]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expected TrieBranchNode is not found in the prepared TrieBranchNode`)
      }
    }
  } else if (isTrieLeafNode(preparedTrieNode)) {
    for (const [k, v] of Object.entries(expectedTrieNode)) {
      if (Object.prototype.hasOwnProperty.call(preparedTrieNode, k)) {
        const actualVal = preparedTrieNode[k as keyof TrieLeafNode]
        if (Array.isArray(v)) {
          if (Array.isArray(actualVal)) {
            assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}
            actual value: ${actualVal}, expected value: ${v}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer[]`)
          }
        } else if (v instanceof CID) {
          if (actualVal instanceof CID) {
            assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type CID`)
          }
        } else if (v instanceof Buffer) {
          if (actualVal instanceof Buffer) {
            assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer`)
          }
        } else {
          assert.equal(preparedTrieNode[k as keyof TrieLeafNode], v, `actual ${k}: ${preparedTrieNode[k as keyof TrieLeafNode]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expected TrieLeafNode is not found in the prepared TrieLeafNode`)
      }
    }
  } else if (isTrieExtensionNode(preparedTrieNode)) {
    for (const [k, v] of Object.entries(expectedTrieNode)) {
      if (Object.prototype.hasOwnProperty.call(preparedTrieNode, k)) {
        const actualVal = preparedTrieNode[k as keyof TrieExtensionNode]
        if (Array.isArray(v)) {
          if (Array.isArray(actualVal)) {
            assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer[]`)
          }
        } else if (v instanceof CID) {
          if (actualVal instanceof CID) {
            assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type CID`)
          }
        } else if (v instanceof Buffer) {
          if (actualVal instanceof Buffer) {
            assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer`)
          }
        } else {
          assert.equal(preparedTrieNode[k as keyof TrieExtensionNode], v, `actual ${k}: ${preparedTrieNode[k as keyof TrieExtensionNode]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expected TrieExtensionNode is not found in the prepared TrieExtensionNode`)
      }
    }
  }
  expect(() => validate(code, preparedTrieNode)).to.not.throw()
}
