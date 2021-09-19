import { CID } from 'multiformats/cid'
import { Logs } from '../../log/src/interface'
import * as BN from 'bn.js'

export interface Receipt {
    TxType: number,
    PostState?: Buffer,
    Status?: number,
    CumulativeGasUsed: BN,
    Bloom: Buffer,
    Logs: Logs,
    LogRootCID: CID
}
