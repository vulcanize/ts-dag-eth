import { CID } from "multiformats/cid";

export interface Account {
    Nonce: bigint,
    Balance: bigint,
    StorageRootCID: CID,
    CodeCID: CID
}
