import { ByteView } from 'multiformats/codecs/interface'
import { Header } from '../src/interface'
import { cidFromHash, hashFromCID } from '../../util/src/util'
import { code as stateTrieCode } from '../../state_trie/src/index'
import { code as txTrieCode } from '../../tx_trie/src/index'
import { code as rctTrieCode } from '../../rct_trie/src/index'
import { code as unclesCode } from '../../uncles/src/index'
import { BlockHeader } from '@ethereumjs/block'

export const name = 'eth-block'
export const code = 0x90

export function encode (node: Header): ByteView<Header> {
  const ethBlockHeader = BlockHeader.fromHeaderData({
    parentHash: hashFromCID(node.ParentCID),
    uncleHash: hashFromCID(node.UnclesCID),
    coinbase: node.Coinbase,
    stateRoot: hashFromCID((node.StateRootCID)),
    transactionsTrie: hashFromCID(node.TxRootCID),
    receiptTrie: hashFromCID(node.RctRootCID),
    bloom: node.Bloom,
    difficulty: node.Difficulty,
    number: node.Number,
    gasLimit: node.GasLimit,
    gasUsed: node.GasUsed,
    timestamp: node.Time,
    extraData: node.Extra,
    mixHash: node.MixDigest,
    nonce: node.Nonce
  })
  if (typeof node.BaseFee !== 'undefined') {
    Object.defineProperty(ethBlockHeader, 'baseFeePerGas', {
      value: node.BaseFee
    })
  }
  return ethBlockHeader.serialize()
}

export function decode (bytes: ByteView<Header>): Header {
  const bytesBuffer = Buffer.from(bytes.valueOf())
  const ethHeader = BlockHeader.fromRLPSerializedHeader(bytesBuffer)
  const dagHeader: Header = {
    ParentCID: cidFromHash(code, ethHeader.parentHash),
    UnclesCID: cidFromHash(unclesCode, ethHeader.uncleHash),
    Coinbase: ethHeader.coinbase,
    StateRootCID: cidFromHash(stateTrieCode, ethHeader.stateRoot),
    TxRootCID: cidFromHash(txTrieCode, ethHeader.transactionsTrie),
    RctRootCID: cidFromHash(rctTrieCode, ethHeader.receiptTrie),
    Bloom: ethHeader.bloom,
    Difficulty: ethHeader.difficulty,
    Number: ethHeader.number,
    GasLimit: ethHeader.gasLimit,
    GasUsed: ethHeader.gasUsed,
    Time: ethHeader.timestamp,
    Extra: ethHeader.extraData,
    MixDigest: ethHeader.mixHash,
    Nonce: ethHeader.nonce
  }
  if (typeof ethHeader.baseFeePerGas !== 'undefined') {
    Object.defineProperty(dagHeader, 'BaseFee', {
      value: BigInt(ethHeader.baseFeePerGas.toString())
    })
  }
  return dagHeader
}
