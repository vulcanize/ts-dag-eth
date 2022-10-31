import { assert, expect } from 'chai'
import { name } from '../src'
import {
  isTrieExtensionNode,
  isTrieBranchNode,
  isTrieLeafNode,
  TrieExtensionNode,
  TrieLeafNode,
  TrieNode
} from '../src/interface'
import { checkEquality } from './util'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { packBranchNode, packTwoMemberNode } from '../../trie/src/helpers'
import { addHexPrefix } from 'merkle-patricia-tree/dist/util/hex'
import { rlp } from 'ethereumjs-util'
import { nibblesToBuffer } from '../../util/src/util'
import { codecs } from '../../'

const logTrieCodec = codecs[name]
const test = it
const same = assert.deepStrictEqual

const branchNodeFileName = 'branch_node_with_embedded_log_leaf_and_value_rlp'
const leafNodeFileName = 'log_leaf_node_rlp'
const extensionNodeFileName = 'extension_node_rlp'

describe('eth-trie', function () {
  const extensionNodeFilePath = __dirname.concat('/', extensionNodeFileName)
  const branchNodeFilePath = __dirname.concat('/', branchNodeFileName)
  const leafFilePath = __dirname.concat('/', leafNodeFileName)
  const extensionNodeRLP = fs.readFileSync(extensionNodeFilePath)
  const branchNodeRLP = fs.readFileSync(branchNodeFilePath)
  const leafNodeRLP = fs.readFileSync(leafFilePath)

  const extensionNodeBuffer = rlp.decode(extensionNodeRLP)
  assert.isTrue(Array.isArray(extensionNodeBuffer), 'extension node buffer is not an array')
  assert(extensionNodeBuffer.length === 2)
  const expectedExtension = packTwoMemberNode(logTrieCodec.code, extensionNodeBuffer as any) as TrieNode
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
  const expectedLeaf = packTwoMemberNode(logTrieCodec.code, leafNodeBuffer as any) as TrieNode
  assert(isTrieLeafNode(expectedLeaf), 'expected leaf node does not satisfy leaf node interface')
  const expectedLeafNode = <TrieLeafNode>expectedLeaf
  const anyLeafNode: any = {
    PartialPath: expectedLeafNode.PartialPath.toString(),
    Value: expectedLeafNode.Value
  }

  const branchNodeBuffer = rlp.decode(branchNodeRLP)
  assert(Array.isArray(branchNodeBuffer), 'branch node buffer is not an array')
  assert(branchNodeBuffer.length === 17)
  const expectedBranchNode = packBranchNode(logTrieCodec.code, branchNodeBuffer as any) as TrieNode
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
    const extensionNode: TrieNode = logTrieCodec.decode(extensionNodeRLP)
    same(extensionNode, expectedExtensionNode)
    const extensionNodeEnc = logTrieCodec.encode(extensionNode)
    same(extensionNodeEnc, extensionNodeRLP)

    const leafNode: TrieNode = logTrieCodec.decode(leafNodeRLP)
    same(leafNode, expectedLeaf)
    const leafNodeEnc = logTrieCodec.encode(leafNode)
    same(leafNodeEnc, leafNodeRLP)

    const branchNode: TrieNode = logTrieCodec.decode(branchNodeRLP)
    same(branchNode, expectedBranchNode)
    const branchNodeEnc = logTrieCodec.encode(branchNode)
    same(branchNodeEnc, branchNodeRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyBranchNode as any)).to.throw()
    const preparedBranchNode = prepare(anyBranchNode)
    checkEquality(expectedBranchNode, preparedBranchNode)
    expect(() => validate(preparedBranchNode)).to.not.throw()

    expect(() => validate(anyLeafNode as any)).to.throw()
    const preparedLeafNode = prepare(anyLeafNode)
    checkEquality(expectedLeafNode, preparedLeafNode)
    expect(() => validate(preparedLeafNode)).to.not.throw()

    expect(() => validate(anyExtensionNode as any)).to.throw()
    const preparedExtensionNode = prepare(anyExtensionNode)
    checkEquality(expectedExtensionNode, preparedExtensionNode)
    expect(() => validate(preparedExtensionNode)).to.not.throw()
  })
})
