import { Log, LogBuffer, Logs, LogsBuffer } from './interface'
import { Address } from 'ethereumjs-util'

export function convertLogToLogBuffer (log: Log): LogBuffer {
  return [
    log.Address.toBuffer(),
    log.Topics,
    log.Data
  ]
}
export function convertLogsToLogsBuffer (logs: Logs): LogsBuffer {
  const logsBuffer = new Array<LogBuffer>(logs.length)
  logs.forEach((log, i) => {
    logsBuffer[i] = convertLogToLogBuffer(log)
  })
  return logsBuffer
}

export function convertLogBufferToLog (logBuffer: LogBuffer): Log {
  return {
    Address: new Address(logBuffer[0]),
    Topics: logBuffer[1],
    Data: logBuffer[2]
  }
}

export function convertLogsBufferToLogs (logsBuffer: LogsBuffer): Logs {
  const logs = new Array<Log>(logsBuffer.length)
  logsBuffer.forEach((logBuffer, i) => {
    logs[i] = convertLogBufferToLog(logBuffer)
  })
  return logs
}
