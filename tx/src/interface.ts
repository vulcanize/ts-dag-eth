import { AccessListBuffer } from '@ethereumjs/tx'
import * as BN from 'bn.js'
import { Address } from 'ethereumjs-util'

export interface Transaction {
    TxType: number,
    ChainID?: BN,
    AccountNonce: BN,
    GasPrice?: BN,
    GasTipCap?: BN,
    GasFeeCap?: BN,
    GasLimit: BN,
    Recipient?: Address,
    Amount: BN,
    Data: Buffer,
    AccessList?: AccessListBuffer,
    V: BN,
    R: BN,
    S: BN
}
