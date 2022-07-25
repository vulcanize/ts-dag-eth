import { CID } from "multiformats/cid";

export interface Block {
    Header: CID,
    Transactions: CID,
    Receipts: CID
}
