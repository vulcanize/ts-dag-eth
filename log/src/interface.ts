import { hasOnlyProperties } from '../../util/src/util'

type Topics = Buffer[]

export interface Log {
    Address: Buffer,
    Topics: Topics,
    Data: Buffer
}

export const logNodeProperties = ['Address', 'Topics', 'Data']

export type LogBuffer = [Buffer, Buffer[], Buffer]

export type Logs = Log[]

export type LogsBuffer = LogBuffer[]

export function isLog (x: any): x is Log {
  if ((x as Log).Address === undefined) {
    return false
  }
  if ((x as Log).Topics === undefined) {
    return false
  }
  if ((x as Log).Data === undefined) {
    return false
  }
  return hasOnlyProperties(x, logNodeProperties)
}
