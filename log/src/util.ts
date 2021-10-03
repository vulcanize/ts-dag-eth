import { Log } from './interface'
import { hasOnlyProperties } from '../../util/src/util'
const toBuffer = require('typedarray-to-buffer')

const logNodeProperties = ['Address', 'Topics', 'Data']

export function prepare (node: any): Log {
  let address: Buffer
  let topics: Buffer[]
  let data: Buffer

  if (node.Address == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Address is null/undefined')
  } else if (typeof node.Address === 'string') {
    address = Buffer.from(node.Address, 'hex')
  } else if (node.Address instanceof Uint8Array) {
    address = toBuffer(node.Address)
  } else if (node.Address instanceof Buffer) {
    address = node.Address
  } else {
    throw new TypeError('Invalid eth-receipt-log form; node.Address needs to be of type Buffer')
  }

  if (node.Topics == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Topics is null/undefined')
  } else if (Array.isArray(node.Topics)) {
    for (const topic of node.Topics) {
      if (!(topic instanceof Buffer)) {
        throw new TypeError('Invalid eth-receipt-log form; node.Topics needs to be of type Topics')
      }
    }
    topics = node.Topics
  } else {
    throw new TypeError('Invalid eth-receipt-log form; node.Topics needs to be of type Topics')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Data is null/undefined')
  } else if (typeof node.Data === 'string') {
    data = Buffer.from(node.Data, 'hex')
  } else if (node.Data instanceof Uint8Array) {
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

  if (!hasOnlyProperties(node, logNodeProperties)) {
    throw new TypeError('Invalid eth-receipt-log form (extraneous properties)')
  }

  if (node.Address == null) {
    throw new TypeError('Invalid eth-receipt-log form; node.Address is null/undefined')
  } else if (!(node.Address instanceof Buffer)) {
    throw new TypeError('Invalid eth-receipt-log form; node.Address needs to be of type Buffer')
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
