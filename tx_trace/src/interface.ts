import { CID } from "multiformats/cid";

export type TxCIDList = CID[];

export type RawTxCIDList = Uint8Array[];

export interface Frame {
    Op: Uint8Array,
    From: Uint8Array,
    To: Uint8Array,
    Input: Uint8Array,
    Output: Uint8Array,
    Gas: BigInteger,
    Cost: BigInteger,
    Value: BigInteger
}

export type FrameList = Frame[];

export interface TxTrace {
    TxCIDs: TxCIDList,
    StateRootCID: CID,
    Result: Uint8Array,
    Frames: FrameList,
    Gas: BigInteger,
    Failed: boolean
}

export interface RawTxTrace {
    TxCIDs: RawTxCIDList,
    StateRootCID: Uint8Array,
    Result: Uint8Array,
    Frames: FrameList,
    Gas: BigInteger,
    Failed: boolean
}
