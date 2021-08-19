import { CID } from "multiformats/cid";

export interface Header {
    ParentCID: CID,
    UnclesCID: CID,
    Coinbase: Uint8Array,
    StateRootCID: CID,
    TxRootCID: CID,
    RctRootCID: CID,
    Bloom: Uint8Array,
    Difficulty: BigInteger,
    Number: BigInteger,
    GasLimit: BigInteger,
    GasUsed: BigInteger,
    Time: number,
    Extra: Uint8Array,
    MixDigest: Uint8Array,
    Nonce: BigInteger,
    BaseFee?: BigInteger
}

export interface RawHeader {
    ParentCID: Uint8Array,
    UnclesCID: Uint8Array,
    Coinbase: Uint8Array,
    StateRootCID: Uint8Array,
    TxRootCID: Uint8Array,
    RctRootCID: Uint8Array,
    Bloom: Uint8Array,
    Difficulty: BigInteger,
    Number: BigInteger,
    GasLimit: BigInteger,
    GasUsed: BigInteger,
    Time: number,
    Extra: Uint8Array,
    MixDigest: Uint8Array,
    Nonce: BigInteger,
    BaseFee?: BigInteger
}
