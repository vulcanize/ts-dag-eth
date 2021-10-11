import { CodecCode } from 'multicodec'
import { isTrieBranchNode, isTrieExtensionNode, isTrieLeafNode, TrieNode } from './interface'
import { ByteView } from 'multiformats/codecs/interface'
import { packBranchNode, packExtensionNode, packLeafNode, unpackBranchNode, unpackTwoMemberNode } from './helpers'
import { rlp } from 'ethereumjs-util'

export function encode (node: TrieNode): ByteView<TrieNode> {
  if (isTrieBranchNode(node)) {
    return rlp.encode(packBranchNode(node))
  }
  if (isTrieExtensionNode(node)) {
    return rlp.encode(packExtensionNode(node))
  }
  if (isTrieLeafNode(node)) {
    return rlp.encode(packLeafNode(node))
  }
  throw new Error('provided TrieNode is not one of the expected kinds (branch, extension, leaf)')
}

export function decode (code: CodecCode, bytes: ByteView<TrieNode>): TrieNode {
  const decoded = rlp.decode(bytes)
  if (!Array.isArray(decoded)) {
    throw new Error('TrieNode is expected to decode into an Array')
  }
  if (decoded.length === 17) { // is a branch node
    return unpackBranchNode(code, decoded)
  }
  // is either an extension or leaf
  return unpackTwoMemberNode(code, decoded)
}
