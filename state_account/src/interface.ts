import { CID } from "multiformats/cid";

export interface Account {
    Nonce: BigInteger,
    Balance: BigInteger,
    StorageRootCID: CID,
    CodeCID: CID
}

export interface RawAccount {
    Nonce: BigInteger,
    Balance: BigInteger,
    StorageRootCID: Uint8Array,
    CodeCID: Uint8Array
}
