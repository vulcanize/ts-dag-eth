import chai, { expect } from 'chai'
import { encode, decode, code } from '../src/index'
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
import { CID } from 'multiformats/cid'
import { Address } from 'ethereumjs-util'
import BN from 'bn.js'

const { assert } = chai
const test = it
const same = assert.deepEqual

/*
export interface Header {
    ParentCID: CID,
    UnclesCID: CID,
    Coinbase: Address,
    StateRootCID: CID,
    TxRootCID: CID,
    RctRootCID: CID,
    Bloom: Buffer,
    Difficulty: BN,
    Number: BN,
    GasLimit: BN,
    GasUsed: BN,
    Time: BN,
    Extra: Buffer,
    MixDigest: Buffer,
    Nonce: Buffer,
    BaseFee?: BN
}
*/

const blockRLPFileName = 'block1_rlp'

describe('eth-block', function () {
  const dirname = __dirname.concat('/', blockRLPFileName)
  const blockRLP = fs.readFileSync(dirname)
  const block: Block = Block.fromRLPSerializedBlock(blockRLP)
  const header: BlockHeader = block.header
  const headerRLP = header.serialize()
  const expectedHeaderNode: Header = pack(header)
  const anyHeader: any = {
    ParentCID: cidFromHash(code, header.parentHash).toString(),
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
    const headerNode: Header = decode(headerRLP)
    same(headerNode, expectedHeaderNode)
    const headerEnc = encode(headerNode)
    same(headerEnc, headerRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyHeader as any)).to.throw()
    const preparedHeader = prepare(anyHeader)
    for (const [k, v] of Object.entries(expectedHeaderNode)) {
      if (Object.prototype.hasOwnProperty.call(preparedHeader, k)) {
        const actualVal = preparedHeader[k as keyof Header]
        if (v instanceof CID) {
          if (actualVal instanceof CID) {
            assert.equal(actualVal.toString(), v.toString(), ` actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type CID`)
          }
        } else if (v instanceof Address) {
          if (actualVal instanceof Address) {
            assert.equal(actualVal.toString(), v.toString(), ` actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Address`)
          }
        } else if (v instanceof Buffer) {
          if (actualVal instanceof Buffer) {
            assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type Buffer`)
          }
        } else if (v instanceof BN) {
          if (actualVal instanceof BN) {
            assert.equal(v.toNumber(), actualVal.toNumber(), `actual ${k}: ${actualVal.toNumber()} does not equal expected: ${v.toNumber()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type BN`)
          }
        } else {
          assert.equal(preparedHeader[k as keyof Header], v, `actual ${k}: ${preparedHeader[k as keyof Header]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expectedHeaderNode is not found in the preparedHeader`)
      }
    }
    expect(() => validate(preparedHeader)).to.not.throw()
  })
})
