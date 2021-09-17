import { CID } from 'multiformats/cid'
import * as BN from 'bn.js'

export interface Account {
    Nonce: BN,
    Balance: BN,
    StorageRootCID: CID,
    CodeCID: CID
}
