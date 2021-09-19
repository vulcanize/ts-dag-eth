import { Log, LogBuffer, Logs, LogsBuffer } from './interface'

export function convertLogsToLogsBuffer (logs: Logs): LogsBuffer {
  const logsBuffer = new Array<LogBuffer>(logs.length)

  for (const [i, log] of logs.entries()) {
    logsBuffer[i] = [
      log.Address,
      log.Topics,
      log.Data
    ]
  }

  return logsBuffer
}

export function convertLogsBufferToLogs (logsBuffer: LogsBuffer): Logs {
  const logs = new Array<Log>(logsBuffer.length)

  for (const [i, logBuffer] of logsBuffer.entries()) {
    logs[i] = {
      Address: logBuffer[0],
      Topics: logBuffer[1],
      Data: logBuffer[2]
    }
  }

  return logs
}
