import { CID } from "multiformats/cid";
import { Logs } from "../../log/src/interface";


export interface Receipt {
    TxType: number,
    PostState?: Uint8Array,
    Status?: BigInteger,
    CumulativeGasUsed: BigInteger,
    Bloom: Uint8Array,
    Logs: Logs,
    LogRootCID: CID
}

export interface RawReceipt {
    TxType: number,
    PostState?: Uint8Array,
    Status?: BigInteger,
    CumulativeGasUsed: BigInteger,
    Bloom: Uint8Array,
    Logs: Logs,
    LogRootCID: Uint8Array
}
