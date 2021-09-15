import { CID } from 'multiformats/cid'
import * as BN from 'bn.js'
import { Address } from 'ethereumjs-util'

export interface Header {
    ParentCID: CID,
    UnclesCID: CID,
    Coinbase: Address,
    StateRootCID: CID,
    TxRootCID: CID,
    RctRootCID: CID,
    Bloom: Buffer,
    Difficulty: BN,
    Number: BN,
    GasLimit: BN,
    GasUsed: BN,
    Time: BN,
    Extra: Buffer,
    MixDigest: Buffer,
    Nonce: Buffer,
    BaseFee?: BN
}
