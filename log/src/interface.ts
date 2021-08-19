type Topics = Uint8Array[];

export type Logs = Log[];

export interface Log {
    Address: Uint8Array,
    Topics: Topics,
    Data: Uint8Array
}
