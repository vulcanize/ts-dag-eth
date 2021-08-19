type StorageKeys = Uint8Array[];

export interface AccessElement {
    Address: Uint8Array,
    StorageKeys:StorageKeys
}

export type AccessList = AccessElement[];

export interface Transaction {
    TxType: number,
    ChainID?: BigInteger,
    AccountNonce: BigInteger,
    GasPrice?: BigInteger,
    GasTipCap?: BigInteger,
    GasFeeCap?: BigInteger,
    GasLimit: BigInteger,
    Recipient: Uint8Array,
    Amount: BigInteger,
    Data: Uint8Array,
    AccessList: AccessList,
    V: BigInteger,
    R: BigInteger,
    S: BigInteger
}
