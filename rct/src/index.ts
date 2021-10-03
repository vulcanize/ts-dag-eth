import { ByteView } from 'multiformats/codecs/interface'
import { Receipt } from './interface'
import { ReceiptFactory } from './types'
import { unpack, pack } from './helpers'
const toBuffer = require('typedarray-to-buffer')

export const name = 'eth-tx-receipt'
export const code = 0x95

export function encode (node: Receipt): ByteView<Receipt> {
  return unpack(node).serialize()
}

export function decode (bytes: ByteView<Receipt>): Receipt {
  const rct = ReceiptFactory.fromSerializedRct(toBuffer(bytes))
  return pack(rct)
}
