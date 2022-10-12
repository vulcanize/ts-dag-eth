import chai, { expect } from 'chai'
import { name } from '../src'
import { pack } from '../src/helpers'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { Block, BlockHeader } from '@ethereumjs/block'
import { Header } from '../src/interface'
import { code as unclesCode } from '../../uncles/src'
import { code as stateTrieCode } from '../../state_trie/src'
import { code as txTrieCode } from '../../tx_trie/src'
import { code as rctTrieCode } from '../../rct_trie/src'
import { cidFromHash } from '../../util/src/util'
import { checkEquality } from './util'
import { codecs } from '../../index'

const headerCodec = codecs[name]
const { assert } = chai
const test = it
const same = assert.deepEqual

const blockRLPFileName = 'block1_rlp'

describe('eth-block', function () {
  const dirname = __dirname.concat('/', blockRLPFileName)
  const blockRLP = fs.readFileSync(dirname)
  const block: Block = Block.fromRLPSerializedBlock(blockRLP)
  const header: BlockHeader = block.header
  const headerRLP = header.serialize()
  const expectedHeaderNode: Header = pack(header)
  const anyHeader: any = {
    ParentCID: cidFromHash(headerCodec.code, header.parentHash).toString(),
    UnclesCID: cidFromHash(unclesCode, header.uncleHash).toString(),
    Coinbase: header.coinbase.toString(),
    StateRootCID: cidFromHash(stateTrieCode, header.stateRoot).toString(),
    TxRootCID: cidFromHash(txTrieCode, header.transactionsTrie).toString(),
    RctRootCID: cidFromHash(rctTrieCode, header.receiptTrie).toString(),
    Bloom: header.bloom.toString('hex'),
    Difficulty: header.difficulty.toString(),
    Number: header.number.toString(),
    GasLimit: header.gasLimit.toString(),
    GasUsed: header.gasUsed.toString(),
    Time: header.timestamp.toString(),
    Extra: header.extraData.toString('hex'),
    MixDigest: header.mixHash.toString('hex'),
    Nonce: header.nonce.toString('hex'),
    BaseFee: null
  }

  test('encode and decode round trip', () => {
    const headerNode: Header = headerCodec.decode(headerRLP)
    same(headerNode, expectedHeaderNode)
    const headerEnc = headerCodec.encode(headerNode)
    same(headerEnc, headerRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyHeader as any)).to.throw()
    const preparedHeader = prepare(anyHeader)
    checkEquality(expectedHeaderNode, preparedHeader)
    expect(() => validate(preparedHeader)).to.not.throw()
  })
})
