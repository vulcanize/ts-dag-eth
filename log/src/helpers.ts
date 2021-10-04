import { Log, LogBuffer, Logs, LogsBuffer } from './interface'

export function convertLogsToLogsBuffer (logs: Logs): LogsBuffer {
  const logsBuffer = new Array<LogBuffer>(logs.length)
  logs.forEach((log, i) => {
    logsBuffer[i] = [
      log.Address,
      log.Topics,
      log.Data
    ]
  })
  return logsBuffer
}

export function convertLogsBufferToLogs (logsBuffer: LogsBuffer): Logs {
  const logs = new Array<Log>(logsBuffer.length)
  logsBuffer.forEach((logBuffer, i) => {
    logs[i] = {
      Address: logBuffer[0],
      Topics: logBuffer[1],
      Data: logBuffer[2]
    }
  })
  return logs
}
