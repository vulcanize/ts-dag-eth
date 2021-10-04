import {
  RECEIPT_STATUS_FAILED_RLP,
  RECEIPT_STATUS_SUCCESS_RLP,
  TypedReceipt,
  ReceiptData,
  ReceiptFactory
} from './types'
import { Receipt } from './interface'
import { convertLogsBufferToLogs, convertLogsToLogsBuffer } from '../../log/src/helpers'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { rlp } from 'ethereumjs-util'
import { cidFromHash } from '../../util/src/util'
import { code as logTrieCode } from '../../log_trie/src/index'

export function resolvePostStateOrStatus (postStateOrStatus: Buffer): [Buffer | undefined, number | undefined] {
  let postState: Buffer | undefined
  let status: number | undefined
  if (postStateOrStatus === RECEIPT_STATUS_FAILED_RLP) {
    status = 0
    postState = undefined
  } else if (postStateOrStatus === RECEIPT_STATUS_SUCCESS_RLP) {
    status = 1
    postState = undefined
  } else {
    status = undefined
    postState = postStateOrStatus
  }

  return [postState, status]
}

export function unpack (node: Receipt): TypedReceipt {
  const rctData: ReceiptData = {
    TxType: node.TxType,
    PostState: node.PostState,
    Status: node.Status,
    CumulativeGasUsed: node.CumulativeGasUsed,
    Bloom: node.Bloom,
    Logs: convertLogsToLogsBuffer(node.Logs)
  }

  return ReceiptFactory.fromReceiptData(rctData)
}

export function pack (receipt: TypedReceipt): Receipt {
  const trie = new Trie()
  for (const [i, logBuffer] of receipt.logs) {
    trie.put(rlp.encode(i), rlp.encode(logBuffer)).then().catch((err) => {
      throw Error(`trie put operation failed ${err}`)
    })
  }
  return {
    TxType: receipt.type,
    PostState: receipt.postState,
    Status: receipt.status,
    CumulativeGasUsed: receipt.cumulativeGasUsed,
    Bloom: receipt.bloom,
    Logs: convertLogsBufferToLogs(receipt.logs),
    LogRootCID: cidFromHash(logTrieCode, trie.root)
  }
}
