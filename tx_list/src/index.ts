import { ByteView } from 'multiformats/codecs/interface'
import { TypedTransaction, TransactionFactory } from '@ethereumjs/tx'
import { Transactions } from './interface'
import { Transaction } from '../../tx/src/interface'
import { pack, unpack } from '../../tx/src/helpers'
import { rlp } from 'ethereumjs-util'

export const name = 'eth-tx-list'
export const code = 0x9b

export function encode (node: Transactions): ByteView<Transactions> {
  const txs = new Array<Buffer>(node.length)
  node.forEach((tx, i) => {
    const txData: TypedTransaction = unpack(tx)
    txs[i] = txData.serialize()
  })
  return rlp.encode(txs)
}

export function decode (bytes: ByteView<Transactions>): Transactions {
  const txs = rlp.decode(bytes)
  if (!Array.isArray(txs)) {
    throw new Error('Invalid serialized txs input. Must be array')
  }
  const node: Transactions = new Array<Transaction>(txs.length)
  txs.forEach((serializedTx, i) => {
    const tx: TypedTransaction = TransactionFactory.fromSerializedData(serializedTx)
    node[i] = pack(tx)
  })
  return node
}
