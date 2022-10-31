import { assert } from 'chai'
import {
  isTrieExtensionNode,
  isTrieBranchNode,
  isTrieLeafNode,
  TrieBranchNode,
  TrieExtensionNode,
  TrieLeafNode,
  TrieNode
} from '../src/interface'
import { isLog } from '../../log/src/interface'
import { checkEquality as checkLogEquality } from '../../log/test/util'
import { CID } from 'multiformats/cid'

export function checkEquality (expected: TrieNode, got: TrieNode) {
  if (isTrieBranchNode(got)) {
    for (const [k, v] of Object.entries(expected)) {
      if (Object.prototype.hasOwnProperty.call(got, k)) {
        const actualVal = got[k as keyof TrieBranchNode]
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
        } else if (v == null) {
          assert(actualVal == null, `actual ${k}: ${actualVal} does not equal expected: ${v}`)
        } else if (isLog(v)) {
          if (isLog(actualVal)) {
            checkLogEquality(v, actualVal)
          } else {
            throw new TypeError(`ley ${k} expected to be of type Log
            expected value: ${v}, actual value: ${actualVal}`)
          }
        } else {
          assert.equal(got[k as keyof TrieBranchNode], v, `actual ${k}: ${got[k as keyof TrieBranchNode]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expected TrieBranchNode is not found in the prepared TrieBranchNode`)
      }
    }
  } else if (isTrieLeafNode(got)) {
    for (const [k, v] of Object.entries(expected)) {
      if (Object.prototype.hasOwnProperty.call(got, k)) {
        const actualVal = got[k as keyof TrieLeafNode]
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
        } else if (isLog(v)) {
          if (isLog(actualVal)) {
            checkLogEquality(v, actualVal)
          } else {
            throw new TypeError(`ley ${k} expected to be of type Log
            expected value: ${v}, actual value: ${actualVal}`)
          }
        } else {
          assert.equal(got[k as keyof TrieLeafNode], v, `actual ${k}: ${got[k as keyof TrieLeafNode]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expected TrieLeafNode is not found in the prepared TrieLeafNode`)
      }
    }
  } else if (isTrieExtensionNode(got)) {
    for (const [k, v] of Object.entries(expected)) {
      if (Object.prototype.hasOwnProperty.call(got, k)) {
        const actualVal = got[k as keyof TrieExtensionNode]
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
          assert.equal(got[k as keyof TrieExtensionNode], v, `actual ${k}: ${got[k as keyof TrieExtensionNode]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expected TrieExtensionNode is not found in the prepared TrieExtensionNode`)
      }
    }
  }
}
