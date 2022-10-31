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

const stateTrieCodec = codecs[name]
const test = it
const same = assert.deepStrictEqual

const branchNodeFileName = 'branch_node_rlp'
const contractLeafNodeFileName = 'state_contract_leaf_node_rlp'
const eoaLeafNodeFileName = 'state_eoa_leaf_node_rlp'
const extensionNodeFileName = 'extension_node_rlp'

describe('eth-trie', function () {
  const extensionNodeFilePath = __dirname.concat('/', extensionNodeFileName)
  const branchNodeFilePath = __dirname.concat('/', branchNodeFileName)
  const contractLeafNodeFilePath = __dirname.concat('/', contractLeafNodeFileName)
  const eoaLeafNodeFilePath = __dirname.concat('/', eoaLeafNodeFileName)
  const extensionNodeRLP = fs.readFileSync(extensionNodeFilePath)
  const branchNodeRLP = fs.readFileSync(branchNodeFilePath)
  const contractLeafNodeRLP = fs.readFileSync(contractLeafNodeFilePath)
  const eoaLeafNodeRLP = fs.readFileSync(eoaLeafNodeFilePath)

  const extensionNodeBuffer = rlp.decode(extensionNodeRLP)
  assert.isTrue(Array.isArray(extensionNodeBuffer), 'extension node buffer is not an array')
  assert(extensionNodeBuffer.length === 2)
  const expectedExtension = packTwoMemberNode(stateTrieCodec.code, extensionNodeBuffer as any) as TrieNode
  assert.isTrue(isTrieExtensionNode(expectedExtension), 'expected extension node does not satisfy extension node interface')
  const expectedExtensionNode = <TrieExtensionNode>expectedExtension
  const nodePathCopy = Object.assign([], expectedExtensionNode.PartialPath)
  const prefixedPath = addHexPrefix(nodePathCopy, false)
  const anyExtensionNode: any = {
    PartialPath: nibblesToBuffer(prefixedPath),
    Child: expectedExtensionNode.Child.toString()
  }

  const contractLeafNodeBuffer = rlp.decode(contractLeafNodeRLP)
  assert(Array.isArray(contractLeafNodeBuffer), 'contract leaf node buffer is not an array')
  assert(contractLeafNodeBuffer.length === 2)
  const expectedContractLeaf = packTwoMemberNode(stateTrieCodec.code, contractLeafNodeBuffer as any) as TrieNode
  assert(isTrieLeafNode(expectedContractLeaf), 'expected contract leaf node does not satisfy leaf node interface')
  const expectedContractLeafNode = <TrieLeafNode>expectedContractLeaf
  const anyContractLeafNode: any = {
    PartialPath: expectedContractLeafNode.PartialPath.toString(),
    Value: expectedContractLeafNode.Value
  }

  const eoaLeafNodeBuffer = rlp.decode(eoaLeafNodeRLP)
  assert(Array.isArray(eoaLeafNodeBuffer), 'contract leaf node buffer is not an array')
  assert(eoaLeafNodeBuffer.length === 2)
  const expectedEOALeaf = packTwoMemberNode(stateTrieCodec.code, eoaLeafNodeBuffer as any) as TrieNode
  assert(isTrieLeafNode(expectedEOALeaf), 'expected EOA leaf node does not satisfy leaf node interface')
  const expectedEOALeafNode = <TrieLeafNode>expectedEOALeaf
  const anyEOALeafNode: any = {
    PartialPath: expectedEOALeafNode.PartialPath.toString(),
    Value: expectedEOALeafNode.Value
  }

  const branchNodeBuffer = rlp.decode(branchNodeRLP)
  assert(Array.isArray(branchNodeBuffer), 'branch node buffer is not an array')
  assert(branchNodeBuffer.length === 17)
  const expectedBranchNode = packBranchNode(stateTrieCodec.code, branchNodeBuffer as any) as TrieNode
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
    const extensionNode: TrieNode = stateTrieCodec.decode(extensionNodeRLP)
    same(extensionNode, expectedExtensionNode)
    const extensionNodeEnc = stateTrieCodec.encode(extensionNode)
    same(extensionNodeEnc, extensionNodeRLP)

    const contractLeafNode: TrieNode = stateTrieCodec.decode(contractLeafNodeRLP)
    same(contractLeafNode, expectedContractLeafNode)
    const contractLeafNodeEnc = stateTrieCodec.encode(contractLeafNode)
    same(contractLeafNodeEnc, contractLeafNodeRLP)

    const eoaLeafNode: TrieNode = stateTrieCodec.decode(eoaLeafNodeRLP)
    same(eoaLeafNode, expectedEOALeafNode)
    const eoaLeafNodeEnc = stateTrieCodec.encode(eoaLeafNode)
    same(eoaLeafNodeEnc, eoaLeafNodeRLP)

    const branchNode: TrieNode = stateTrieCodec.decode(branchNodeRLP)
    same(branchNode, expectedBranchNode)
    const branchNodeEnc = stateTrieCodec.encode(branchNode)
    same(branchNodeEnc, branchNodeRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyBranchNode as any)).to.throw()
    const preparedBranchNode = prepare(anyBranchNode)
    checkEquality(expectedBranchNode, preparedBranchNode)
    expect(() => validate(preparedBranchNode)).to.not.throw()

    expect(() => validate(anyContractLeafNode as any)).to.throw()
    const preparedContractLeafNode = prepare(anyContractLeafNode)
    checkEquality(expectedContractLeafNode, preparedContractLeafNode)
    expect(() => validate(preparedContractLeafNode)).to.not.throw()

    expect(() => validate(anyEOALeafNode as any)).to.throw()
    const preparedEOALeafNode = prepare(anyEOALeafNode)
    checkEquality(expectedEOALeafNode, preparedEOALeafNode)
    expect(() => validate(preparedEOALeafNode)).to.not.throw()

    expect(() => validate(anyExtensionNode as any)).to.throw()
    const preparedExtensionNode = prepare(anyExtensionNode)
    checkEquality(expectedExtensionNode, preparedExtensionNode)
    expect(() => validate(preparedExtensionNode)).to.not.throw()
  })
})
