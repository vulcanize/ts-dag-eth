import { Log, LogBuffer } from './interface'
import { ByteView } from 'multiformats/codecs/interface'
import { rlp } from 'ethereumjs-util'
import { convertLogBufferToLog, convertLogToLogBuffer } from './helpers'

export const name = 'eth-receipt-log'
export const code = 0x9a

export function encode (node: Log): ByteView<Log> {
  return rlp.encode(convertLogToLogBuffer(node))
}

export function decode (bytes: ByteView<Log>): Log {
  const buf = rlp.decode(bytes)
  if (!Array.isArray(buf)) {
    throw new Error('output of RLP decoding a log encoding should be an array')
  }
  if (buf.length !== 3) {
    throw new Error('log array should be of length 3')
  }
  if (!Array.isArray(buf[1])) {
    throw new Error('second element of log array should be an array')
  }
  const logBuffer: LogBuffer = [
    buf[0],
    buf[1],
    buf[2]
  ]
  return convertLogBufferToLog(logBuffer)
}
