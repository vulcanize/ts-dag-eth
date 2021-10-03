import { ByteView } from 'multiformats/codecs/interface'
import { Receipts } from './interface'
import { Receipt } from '../../rct/src/interface'
import { pack, unpack } from '../../rct/src/helpers'
import { rlp } from 'ethereumjs-util'
import { ReceiptFactory, TypedReceipt } from '../../rct/src/types'

export const name = 'eth-tx-receipt-list'
export const code = 0x9c

export function encode (node: Receipts): ByteView<Receipts> {
  const rcts = new Array<Buffer>(node.length)
  node.forEach((rct, i) => {
    const rctData: TypedReceipt = unpack(rct)
    rcts[i] = rctData.serialize()
  })
  return rlp.encode(rcts)
}

export function decode (bytes: ByteView<Receipts>): Receipts {
  const rcts = rlp.decode(bytes)
  if (!Array.isArray(rcts)) {
    throw new Error('Invalid serialized rcts input. Must be array')
  }
  const node: Receipts = new Array<Receipt>(rcts.length)
  rcts.forEach((serializedRct, i) => {
    const rct: TypedReceipt = ReceiptFactory.fromSerializedRct(serializedRct)
    node[i] = pack(rct)
  })
  return node
}
