import { CodecCode } from 'multicodec'
import { isTrieBranchNode, isTrieExtensionNode, isTrieLeafNode, TrieBranchNodeValuesArray, TrieNode } from './interface'
import { ByteView } from 'multiformats/codecs/interface'
import { packBranchNode, unpackExtensionNode, unpackLeafNode, unpackBranchNode, packTwoMemberNode } from './helpers'
import { rlp } from 'ethereumjs-util'

export function encode (node: TrieNode): ByteView<TrieNode> {
  if (isTrieBranchNode(node)) {
    return rlp.encode(unpackBranchNode(node))
  }
  if (isTrieExtensionNode(node)) {
    return rlp.encode(unpackExtensionNode(node))
  }
  if (isTrieLeafNode(node)) {
    return rlp.encode(unpackLeafNode(node))
  }
  throw new Error('provided TrieNode is not one of the expected kinds (branch, extension, leaf)')
}

export function decode (code: CodecCode, bytes: ByteView<TrieNode>): TrieNode {
  const decoded = rlp.decode(bytes)
  if (!Array.isArray(decoded)) {
    throw new Error('TrieNode is expected to decode into an Array')
  }
  if (decoded.length === 17) { // is a branch node
    return packBranchNode(code, decoded as TrieBranchNodeValuesArray)
  } else if (decoded.length === 2) {
    // is either an extension or leaf
    return packTwoMemberNode(code, decoded)
  } else {
    throw new Error('TrieNode is expected to be a 2 or 17 member array')
  }
}
