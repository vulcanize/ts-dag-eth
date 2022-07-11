import { ByteView } from 'multiformats/codecs/interface'
import { Transaction } from '../src/interface'
import { TransactionFactory } from '@ethereumjs/tx'
import { pack, unpack } from './helpers'
const toBuffer = require('typedarray-to-buffer')

export const name = 'eth-tx'
export const code = 0x93

export function encode (node: Transaction): ByteView<Transaction> {
  const unpackedTx = unpack(node)
  return unpackedTx.serialize()
}

export function decode (bytes: ByteView<Transaction>): Transaction {
  const typedTx = TransactionFactory.fromSerializedData(toBuffer(bytes))
  return pack(typedTx)
}
