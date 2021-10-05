import { CID } from 'multiformats/cid'
import * as BN from 'bn.js'
import { hasOnlyProperties } from '../../util/src/util'

export interface Account {
    Nonce: BN,
    Balance: BN,
    StorageRootCID: CID,
    CodeCID: CID
}

export const accountNodeProperties = ['Nonce', 'Balance', 'StorageRootCID', 'CodeCID']

export function isAccount (x: any): x is Account {
  if ((x as Account).Nonce === undefined) {
    return false
  }
  if ((x as Account).Balance === undefined) {
    return false
  }
  if ((x as Account).StorageRootCID === undefined) {
    return false
  }
  if ((x as Account).CodeCID === undefined) {
    return false
  }
  return hasOnlyProperties(x, accountNodeProperties)
}
