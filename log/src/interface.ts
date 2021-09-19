type Topics = Buffer[]

export interface Log {
    Address: Buffer,
    Topics: Topics,
    Data: Buffer
}

export type LogBuffer = [Buffer, Buffer[], Buffer]

export type Logs = Log[]

export type LogsBuffer = LogBuffer[]
