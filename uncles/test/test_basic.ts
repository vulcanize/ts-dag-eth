import chai, { expect } from 'chai'
import { name } from '../src'
import { pack } from '../../header/src/helpers'
import { checkEquality } from '../../header/test/util'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { BlockHeader } from '@ethereumjs/block'
import { Uncles } from '../src/interface'
import { code as headerCode } from '../../header/src'
import { code as stateTrieCode } from '../../state_trie/src'
import { code as txTrieCode } from '../../tx_trie/src'
import { code as rctTrieCode } from '../../rct_trie/src'
import { cidFromHash } from '../../util/src/util'
import { rlp } from 'ethereumjs-util'
import { Header } from '../../header/src/interface'
import { codecs } from '../../index'

const unclesCodec = codecs[name]
const { assert } = chai
const test = it
const same = assert.deepEqual

const unclesRLPFileName = 'uncles_rlp'

describe('eth-block-list', function () {
  const dirname = __dirname.concat('/', unclesRLPFileName)
  const unclesRLP = fs.readFileSync(dirname)
  const unclesBuffer = rlp.decode(unclesRLP)
  if (!Array.isArray(unclesBuffer)) {
    throw new Error('Invalid serialized uncles input. Must be array')
  }
  const expectedUnclesNode: Uncles = new Array<Header>(unclesBuffer.length)
  const uncles: BlockHeader[] = new Array<BlockHeader>(unclesBuffer.length)
  unclesBuffer.forEach((uncleBuffer, i) => {
    if (!Array.isArray(uncleBuffer)) {
      throw new Error('Invalid serialized uncles input. Each uncle must be an array')
    }
    const uncle: BlockHeader = BlockHeader.fromValuesArray(uncleBuffer)
    uncles[i] = uncle
    expectedUnclesNode[i] = pack(uncle)
  })
  if (expectedUnclesNode.length !== 2) {
    throw new Error('Uncles list is expected to contain two uncles')
  }
  const anyUncles: any = [
    {
      ParentCID: cidFromHash(headerCode, uncles[0].parentHash).toString(),
      UnclesCID: cidFromHash(unclesCodec.code, uncles[0].uncleHash).toString(),
      Coinbase: uncles[0].coinbase.toString(),
      StateRootCID: cidFromHash(stateTrieCode, uncles[0].stateRoot).toString(),
      TxRootCID: cidFromHash(txTrieCode, uncles[0].transactionsTrie).toString(),
      RctRootCID: cidFromHash(rctTrieCode, uncles[0].receiptTrie).toString(),
      Bloom: uncles[0].bloom.toString('hex'),
      Difficulty: uncles[0].difficulty.toString(),
      Number: uncles[0].number.toString(),
      GasLimit: uncles[0].gasLimit.toString(),
      GasUsed: uncles[0].gasUsed.toString(),
      Time: uncles[0].timestamp.toString(),
      Extra: uncles[0].extraData.toString('hex'),
      MixDigest: uncles[0].mixHash.toString('hex'),
      Nonce: uncles[0].nonce.toString('hex'),
      BaseFee: null
    },
    {
      ParentCID: cidFromHash(headerCode, uncles[1].parentHash).toString(),
      UnclesCID: cidFromHash(unclesCodec.code, uncles[1].uncleHash).toString(),
      Coinbase: uncles[1].coinbase.toString(),
      StateRootCID: cidFromHash(stateTrieCode, uncles[1].stateRoot).toString(),
      TxRootCID: cidFromHash(txTrieCode, uncles[1].transactionsTrie).toString(),
      RctRootCID: cidFromHash(rctTrieCode, uncles[1].receiptTrie).toString(),
      Bloom: uncles[1].bloom.toString('hex'),
      Difficulty: uncles[1].difficulty.toString(),
      Number: uncles[1].number.toString(),
      GasLimit: uncles[1].gasLimit.toString(),
      GasUsed: uncles[1].gasUsed.toString(),
      Time: uncles[1].timestamp.toString(),
      Extra: uncles[1].extraData.toString('hex'),
      MixDigest: uncles[1].mixHash.toString('hex'),
      Nonce: uncles[1].nonce.toString('hex'),
      BaseFee: null
    }
  ]

  test('encode and decode round trip', () => {
    const unclesNode: Uncles = unclesCodec.decode(unclesRLP)
    same(unclesNode, expectedUnclesNode)
    const unclesEnc = unclesCodec.encode(unclesNode)
    same(unclesEnc, unclesRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyUncles as any)).to.throw()
    const preparedUncles = prepare(anyUncles)
    preparedUncles.forEach((uncle, i) => {
      checkEquality(expectedUnclesNode[i], uncle)
    })
    expect(() => validate(preparedUncles)).to.not.throw()
  })
})
