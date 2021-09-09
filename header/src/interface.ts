import { CID } from 'multiformats/cid'

export interface Header {
    ParentCID: CID,
    UnclesCID: CID,
    Coinbase: Uint8Array,
    StateRootCID: CID,
    TxRootCID: CID,
    RctRootCID: CID,
    Bloom: Uint8Array,
    Difficulty: bigint,
    Number: bigint,
    GasLimit: bigint,
    GasUsed: bigint,
    Time: number,
    Extra: Uint8Array,
    MixDigest: Uint8Array,
    Nonce: bigint,
    BaseFee?: bigint
}
