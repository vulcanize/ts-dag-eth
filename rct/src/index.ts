import { ByteView } from 'multiformats/codecs/interface'
import { Receipt } from './interface'
import { ReceiptData, ReceiptFactory } from './types'
import { convertLogsBufferToLogs, convertLogsToLogsBuffer } from '../../log/src/helpers'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { rlp } from 'ethereumjs-util'
import { cidFromHash } from '../../util/src/util'
import { code as logTrieCode } from '../../log_trie/src/index'
const toBuffer = require('typedarray-to-buffer')

export const name = 'eth-tx-receipt'
export const code = 0x95

export function encode (node: Receipt): ByteView<Receipt> {
  let status: number | undefined
  if (node.Status) {
    status = node.Status
  }
  const rctData: ReceiptData = {
    TxType: node.TxType,
    PostState: node.PostState,
    Status: status,
    CumulativeGasUsed: node.CumulativeGasUsed,
    Bloom: node.Bloom,
    Logs: convertLogsToLogsBuffer(node.Logs)
  }

  return ReceiptFactory.fromReceiptData(rctData).serialize()
}

export function decode (bytes: ByteView<Receipt>): Receipt {
  const rct = ReceiptFactory.fromSerializedRct(toBuffer(bytes))
  const trie = new Trie()
  for (const [i, logBuffer] of rct.logs) {
    trie.put(rlp.encode(i), rlp.encode(logBuffer)).then().catch((err) => {
      throw Error(`trie put operation failed ${err}`)
    })
  }
  return {
    TxType: rct.type,
    PostState: rct.postState,
    Status: rct.status,
    CumulativeGasUsed: rct.cumulativeGasUsed,
    Bloom: rct.bloom,
    Logs: convertLogsBufferToLogs(rct.logs),
    LogRootCID: cidFromHash(logTrieCode, trie.root)
  }
}
