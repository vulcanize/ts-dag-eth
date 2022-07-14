import chai, { expect } from 'chai'
import { encode, decode } from '../src/index'
import {
  isTrieExtensionNode,
  isTrieBranchNode,
  isTrieLeafNode,
  TrieExtensionNode,
  TrieLeafNode,
  TrieNode
} from '../src/interface'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { unpackBranchNode, unpackTwoMemberNode } from '../src/helpers'
import { code } from '../../storage_trie/src/'
import { rlp } from 'ethereumjs-util'

const { assert } = chai
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
  assert(Array.isArray(extensionNodeBuffer))
  assert(extensionNodeBuffer.length === 2)
  const expectedExtension = unpackTwoMemberNode(code, extensionNodeBuffer as any)
  assert(isTrieExtensionNode(expectedExtension))
  const expectedExtensionNode = <TrieExtensionNode>expectedExtension
  const anyExtensionNode: any = {
    PartialPath: expectedExtensionNode.PartialPath.toString(),
    Child: expectedExtensionNode.Child.toString()
  }

  const leafNodeBuffer = rlp.decode(leafNodeRLP)
  assert(Array.isArray(leafNodeBuffer))
  assert(leafNodeBuffer.length === 2)
  const expectedLeaf = unpackTwoMemberNode(code, leafNodeBuffer as any)
  assert(isTrieLeafNode(expectedLeaf))
  const expectedLeafNode = <TrieLeafNode>expectedExtension
  const anyLeafNode: any = {
    PartialPath: expectedLeafNode.PartialPath.toString(),
    Value: expectedLeafNode.Value.toString()
  }

  const branchNodeBuffer = rlp.decode(branchNodeRLP)
  assert(Array.isArray(branchNodeBuffer))
  assert(branchNodeBuffer.length === 17)
  const expectedBranchNode = unpackBranchNode(code, branchNodeBuffer as any)
  assert(isTrieBranchNode(expectedBranchNode))
  const anyBranchNode: any = {
    Child0: expectedBranchNode.Child0,
    Child1: expectedBranchNode.Child1,
    Child2: expectedBranchNode.Child2,
    Child3: expectedBranchNode.Child3,
    Child4: expectedBranchNode.Child4,
    Child5: expectedBranchNode.Child5,
    Child6: expectedBranchNode.Child6,
    Child7: expectedBranchNode.Child7,
    Child8: expectedBranchNode.Child8,
    Child9: expectedBranchNode.Child9,
    ChildA: expectedBranchNode.ChildA,
    ChildB: expectedBranchNode.ChildB,
    ChildC: expectedBranchNode.ChildC,
    ChildD: expectedBranchNode.ChildD,
    ChildE: expectedBranchNode.ChildE,
    ChildF: expectedBranchNode.ChildF,
    Value: expectedBranchNode.Value
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
  const preparedTrieNode: TrieNode = prepare(code, anyTrieNode)
  for (const [k, v] of Object.entries(expectedTrieNode)) {
    if (Object.prototype.hasOwnProperty.call(preparedTrieNode, k)) {
      const actualVal = preparedTrieNode[k as keyof TrieNode]
      if (Array.isArray(v)) {
        if (Array.isArray(actualVal)) {
          assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type Buffer[]`)
        }
      } else if (v instanceof Buffer) {
        if (actualVal instanceof Buffer) {
          assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type Buffer`)
        }
      } else {
        assert.equal(preparedTrieNode[k as keyof TrieNode], v, `actual ${k}: ${preparedTrieNode[k as keyof TrieNode]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedTx is not found in the preparedTx`)
    }
  }
  expect(() => validate(code, preparedTrieNode)).to.not.throw()
}
