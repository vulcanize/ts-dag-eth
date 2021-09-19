import { RECEIPT_STATUS_FAILED_RLP, RECEIPT_STATUS_SUCCESS_RLP } from './types'

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
