import { CID } from "multiformats/cid";

export interface Block {
    Header: CID,
    Transactions: CID,
    Receipts: CID
}

export interface RawBlock {
    Header: Uint8Array,
    Transactions: Uint8Array,
    Receipts: Uint8Array
}
