import { ByteView } from 'multiformats/codecs/interface'
import { Header } from '../src/interface'
import { bufferToBigInt, cidFromHash, hashFromCID } from '../../util/src/util'
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
    coinbase: Buffer.from(node.Coinbase),
    stateRoot: hashFromCID((node.StateRootCID)),
    transactionsTrie: hashFromCID(node.TxRootCID),
    receiptTrie: hashFromCID(node.RctRootCID),
    bloom: node.Bloom,
    difficulty: node.Difficulty.toString(),
    number: node.Number.toString(),
    gasLimit: node.GasLimit.toString(),
    gasUsed: node.GasUsed.toString(),
    timestamp: node.Time,
    extraData: node.Extra,
    mixHash: node.MixDigest,
    nonce: node.Nonce.toString()
  })
  if (typeof node.BaseFee !== 'undefined') {
    Object.defineProperty(ethBlockHeader, 'baseFeePerGas', {
      value: node.BaseFee.toString()
    })
  }
  return ethBlockHeader.serialize()
}

export function decode (bytes: ByteView<Header>): Header {
  const bytesBuffer = Buffer.from(bytes.valueOf())
  const ethHeader = BlockHeader.fromRLPSerializedHeader(bytesBuffer)
  const dagHeader = {
    ParentCID: cidFromHash(code, ethHeader.parentHash),
    UnclesCID: cidFromHash(unclesCode, ethHeader.uncleHash),
    Coinbase: ethHeader.coinbase.toBuffer(),
    StateRootCID: cidFromHash(stateTrieCode, ethHeader.stateRoot),
    TxRootCID: cidFromHash(txTrieCode, ethHeader.transactionsTrie),
    RctRootCID: cidFromHash(rctTrieCode, ethHeader.receiptTrie),
    Bloom: ethHeader.bloom,
    Difficulty: BigInt(ethHeader.difficulty.toString()),
    Number: BigInt(ethHeader.number.toString()),
    GasLimit: BigInt(ethHeader.gasLimit.toString()),
    GasUsed: BigInt(ethHeader.gasUsed.toString()),
    Time: ethHeader.timestamp.toNumber(),
    Extra: ethHeader.extraData,
    MixDigest: ethHeader.mixHash,
    Nonce: bufferToBigInt(ethHeader.nonce)
  }
  if (typeof ethHeader.baseFeePerGas !== 'undefined') {
    Object.defineProperty(dagHeader, 'BaseFee', {
      value: BigInt(ethHeader.baseFeePerGas.toString())
    })
  }
  return dagHeader
}
