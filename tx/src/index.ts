import { ByteView } from 'multiformats/codecs/interface'
import { Transaction } from '../src/interface'
import { TransactionFactory } from '@ethereumjs/tx'
import { pack, unpack } from './helpers'

export const name = 'eth-tx'
export const code = 0x93

export function encode (node: Transaction): ByteView<Transaction> {
  return unpack(node).serialize()
}

export function decode (bytes: ByteView<Transaction>): Transaction {
  const bytesBuffer = Buffer.from(bytes.valueOf())
  const typedTx = TransactionFactory.fromSerializedData(bytesBuffer)
  return pack(typedTx)
}
