import { ByteView } from 'multiformats/codecs/interface'
import {
  Transaction as LegacyTransaction,
  FeeMarketEIP1559Transaction,
  AccessListEIP2930Transaction,
  TypedTransaction
} from '@ethereumjs/tx'
import { Transactions } from './interface'
import { Transaction } from '../../tx/src/interface'
import { pack, unpack } from '../../tx/src/helpers'
import { rlp } from 'ethereumjs-util'

export const name = 'eth-tx-list'
export const code = 0x9b

export function encode (node: Transactions): ByteView<Transactions> {
  const txs = new Array(node.length)
  node.forEach((tx, i) => {
    const txData: TypedTransaction = unpack(tx)
    txs[i] = txData.raw()
  })
  return rlp.encode(txs)
}

export function decode (bytes: ByteView<Transactions>): Transactions {
  const txs = rlp.decode(bytes)
  if (!Array.isArray(txs)) {
    throw new Error('Invalid serialized txs input. Must be array')
  }
  const node: Transactions = new Array<Transaction>(txs.length)
  txs.forEach((txDataBuffer, i) => {
    if (!Array.isArray(txDataBuffer)) {
      throw new Error('Invalid serialized txs input. Each tx must be an array')
    }
    let tx: TypedTransaction
    switch (txDataBuffer.length) {
      case 9:
        tx = LegacyTransaction.fromValuesArray(txDataBuffer)
        break
      case 12:
        tx = AccessListEIP2930Transaction.fromValuesArray(txDataBuffer as any)
        break
      case 13:
        tx = FeeMarketEIP1559Transaction.fromValuesArray(txDataBuffer as any)
        break
      default:
        throw new Error('Invalid serialized txs input. Tx array does not have the expected number of elements')
    }
    node[i] = pack(tx)
  })
  return node
}
