import { CID } from "multiformats/cid";
import { Transaction } from "../../tx/src/interface";

export interface TrieBranchNode {
    Child0?: Child,
    Child1?: Child,
    Child2?: Child,
    Child3?: Child,
    Child4?: Child,
    Child5?: Child,
    Child6?: Child,
    Child7?: Child,
    Child8?: Child,
    Child9?: Child,
    ChildA?: Child,
    ChildB?: Child,
    ChildC?: Child,
    ChildD?: Child,
    ChildE?: Child,
    ChildF?: Child,
    Value?: Transaction
}

export interface RawTrieBranchNode {
    Child0?: RawChild,
    Child1?: RawChild,
    Child2?: RawChild,
    Child3?: RawChild,
    Child4?: RawChild,
    Child5?: RawChild,
    Child6?: RawChild,
    Child7?: RawChild,
    Child8?: RawChild,
    Child9?: RawChild,
    ChildA?: RawChild,
    ChildB?: RawChild,
    ChildC?: RawChild,
    ChildD?: RawChild,
    ChildE?: RawChild,
    ChildF?: RawChild,
    Value?: Transaction
}

export interface TrieExtensionNode {
    PartialPath: Uint8Array,
    Child: CID
}

export interface RawTrieExtensionNode {
    PartialPath: Uint8Array,
    Child: Uint8Array
}

export interface TrieLeafNode {
    PartialPath: Uint8Array,
    Value: Transaction
}

export type TrieNode =
    | TrieBranchNode
    | TrieExtensionNode
    | TrieLeafNode;

export type RawTrieNode =
    | RawTrieBranchNode
    | RawTrieExtensionNode
    | TrieLeafNode;

export type Child =
    | TrieNode
    | CID;

export type RawChild =
    | RawTrieNode
    | Uint8Array;
