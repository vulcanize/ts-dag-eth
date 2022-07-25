import { isLog, Log } from './interface'
import { Address } from 'ethereumjs-util'
const toBuffer = require('typedarray-to-buffer')

export function prepare (node: any): Log {
  let address: Address
  let topics: Buffer[]
  let data: Buffer

  if (node.Address == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Address is null/undefined')
  } else if (typeof node.Address === 'string') {
    address = Address.fromString(node.Address)
  } else if (node.Address instanceof Uint8Array || (Array.isArray(node.Address) && node.Address.every((item: any) => typeof item === 'number'))) {
    address = new Address(toBuffer(node.Address.buffer))
  } else if (node.Address instanceof Buffer) {
    address = new Address(node.Address)
  } else if (node.Address instanceof Address) {
    address = node.Address
  } else {
    throw new TypeError('Invalid eth-receipt-log form; node.Address needs to be of type Address')
  }

  if (node.Topics == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Topics is null/undefined')
  } else if (Array.isArray(node.Topics)) {
    topics = new Array<Buffer>(node.Topics.length)
    for (const [i, topic] of node.Topics.entries()) {
      if (typeof topic === 'string') {
        topics[i] = Buffer.from(topic, 'hex')
      } else if (topic instanceof Uint8Array) {
        topics[i] = toBuffer(topic)
      } else if (topic instanceof Buffer) {
        topics[i] = topic
      } else {
        throw new TypeError('Invalid eth-receipt-log form; node.Topics needs to be of type Topics')
      }
    }
  } else {
    throw new TypeError('Invalid eth-receipt-log form; node.Topics needs to be of type Topics')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Data is null/undefined')
  } else if (typeof node.Data === 'string') {
    data = Buffer.from(node.Data, 'hex')
  } else if (node.Data instanceof Uint8Array || (Array.isArray(node.Data) && node.Data.every((item: any) => typeof item === 'number'))) {
    data = toBuffer(node.Data)
  } else if (node.Data instanceof Buffer) {
    data = node.Data
  } else {
    throw new TypeError('Invalid eth-receipt-log form; node.Data needs to be of type Buffer')
  }

  return {
    Address: address,
    Topics: topics,
    Data: data
  }
}

export function validate (node: Log) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-receipt-log form')
  }

  if (!isLog(node)) {
    throw new TypeError('Invalid eth-receipt-log form')
  }

  if (node.Address == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Address is null/undefined')
  } else if (!(node.Address instanceof Address)) {
    throw new TypeError('Invalid eth-receipt-log form; node.Address needs to be of type Address')
  }

  if (node.Topics == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Topics is null/undefined')
  } else if (Array.isArray(node.Topics)) {
    for (const topic of node.Topics) {
      if (!(topic instanceof Buffer)) {
        throw new TypeError('Invalid eth-receipt-log form; node.Topics needs to be of type Topics')
      }
    }
  } else {
    throw new TypeError('Invalid eth-receipt-log form; node.Topics needs to be an Array')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Data is null/undefined')
  } else if (!(node.Data instanceof Buffer)) {
    throw new TypeError('Invalid eth-receipt-log form; node.Data needs to be of type Buffer')
  }
}
