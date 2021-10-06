import { CID } from 'multiformats/cid'
import { Account, accountNodeProperties } from './interface'
import { hasOnlyProperties } from '../../util/src/util'
import BN from 'bn.js'

export function prepare (node: any): Account {
  if (typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-account-snapshot form')
  }

  let nonce: BN
  let balance: BN
  let srCID: CID
  let codeCID: CID

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce === 'string' || typeof node.Nonce === 'number' || node.Nonce instanceof Uint8Array ||
    node.Nonce instanceof Buffer) {
    nonce = new BN(node.Nonce, 10)
  } else if (typeof node.Nonce === 'bigint') {
    nonce = new BN(node.Nonce.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-account-snapshot form; node.Nonce needs to be of type BN')
  }

  if (node.Balance == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.Balance is null/undefined')
  } else if (typeof node.Balance === 'string' || typeof node.Balance === 'number' || node.Balance instanceof Uint8Array ||
    node.Balance instanceof Buffer) {
    balance = new BN(node.Balance, 10)
  } else if (typeof node.Balance === 'bigint') {
    balance = new BN(node.Balance.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-account-snapshot form; node.Balance needs to be of type BN')
  }

  if (node.StorageRootCID == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.StorageRootCID is null/undefined')
  } else if (typeof node.StorageRootCID === 'string') {
    srCID = CID.parse(node.StorageRootCID)
  } else if (node.StorageRootCID instanceof Uint8Array || node.StorageRootCID instanceof Buffer) {
    srCID = CID.decode(node.StorageRootCID)
  } else if (CID.isCID(node.StorageRootCID)) {
    srCID = node.StorageRootCID
  } else {
    throw new TypeError('Invalid eth-account-snapshot form; node.StorageRootCID needs to be of type CID')
  }

  if (node.CodeCID == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.CodeCID is null/undefined')
  } else if (typeof node.CodeCID === 'string') {
    codeCID = CID.parse(node.CodeCID)
  } else if (node.CodeCID instanceof Uint8Array || node.CodeCID instanceof Buffer) {
    codeCID = CID.decode(node.CodeCID)
  } else if (CID.isCID(node.CodeCID)) {
    codeCID = node.CodeCID
  } else {
    throw new TypeError('Invalid eth-account-snapshot form; node.CodeCID needs to be of type CID')
  }

  return {
    Nonce: nonce,
    Balance: balance,
    StorageRootCID: srCID,
    CodeCID: codeCID
  }
}

export function validate (node: Account) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-account-snapshot form')
  }

  if (!hasOnlyProperties(node, accountNodeProperties)) {
    throw new TypeError('Invalid eth-account-snapshot form (extraneous properties)')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.Nonce is null/undefined')
  } else if (!(node.Nonce instanceof BN)) {
    throw new TypeError('Invalid eth-account-snapshot form; node.Nonce needs to be of type BN')
  }

  if (node.Balance == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.Balance is null/undefined')
  } else if (!(node.Balance instanceof BN)) {
    throw new TypeError('Invalid eth-account-snapshot form; node.Balance needs to be of type BN')
  }

  if (node.StorageRootCID == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.StorageRootCID is null/undefined')
  } else if (!CID.isCID(node.StorageRootCID)) {
    throw new TypeError('Invalid eth-account-snapshot form; node.StorageRootCID needs to be of type CID')
  }

  if (node.CodeCID == null) {
    throw new TypeError('Invalid eth-account-snapshot form; node.CodeCID is null/undefined')
  } else if (!CID.isCID(node.CodeCID)) {
    throw new TypeError('Invalid eth-account-snapshot form; node.CodeCID needs to be of type CID')
  }
}
