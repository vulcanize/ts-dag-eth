import { AccessListBuffer } from '@ethereumjs/tx'

export interface Transaction {
    TxType: number,
    ChainID?: bigint,
    AccountNonce: bigint,
    GasPrice?: bigint,
    GasTipCap?: bigint,
    GasFeeCap?: bigint,
    GasLimit: bigint,
    Recipient?: Uint8Array,
    Amount: bigint,
    Data: Uint8Array,
    AccessList?: AccessListBuffer,
    V: bigint,
    R: bigint,
    S: bigint
}
