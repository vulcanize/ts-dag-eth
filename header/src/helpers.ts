import { Header } from './interface'
import { BlockHeader } from '@ethereumjs/block'
import { cidFromHash, hashFromCID } from '../../util/src/util'
import { code as unclesCode } from '../../uncles/src'
import { code as stateTrieCode } from '../../state_trie/src'
import { code as txTrieCode } from '../../tx_trie/src'
import { code as rctTrieCode } from '../../rct_trie/src'
import { code } from './index'

export function unpack (node: Header): BlockHeader {
  const ethHeader: BlockHeader = BlockHeader.fromHeaderData({
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
    Object.defineProperty(ethHeader, 'baseFeePerGas', {
      value: node.BaseFee
    })
  }
  return ethHeader
}

export function pack (header: BlockHeader): Header {
  const headerNode: Header = {
    ParentCID: cidFromHash(code, header.parentHash),
    UnclesCID: cidFromHash(unclesCode, header.uncleHash),
    Coinbase: header.coinbase,
    StateRootCID: cidFromHash(stateTrieCode, header.stateRoot),
    TxRootCID: cidFromHash(txTrieCode, header.transactionsTrie),
    RctRootCID: cidFromHash(rctTrieCode, header.receiptTrie),
    Bloom: header.bloom,
    Difficulty: header.difficulty,
    Number: header.number,
    GasLimit: header.gasLimit,
    GasUsed: header.gasUsed,
    Time: header.timestamp,
    Extra: header.extraData,
    MixDigest: header.mixHash,
    Nonce: header.nonce
  }
  if (typeof header.baseFeePerGas !== 'undefined') {
    Object.defineProperty(headerNode, 'BaseFee', {
      value: BigInt(header.baseFeePerGas.toString())
    })
  }
  return headerNode
}
