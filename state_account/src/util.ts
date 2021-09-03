import { CID } from 'multiformats/cid'
import { Account } from './interface.js'

const accountNodeProperties = ['Nonce', 'Balance', 'StorageRootCID', 'CodeCID']

export function prepare(node: any): Account {
    if (typeof node !== 'object' || Array.isArray(node)) {
        throw new TypeError('Invalid eth-account-snapshop form')
    }

    let nonce: bigint
    let balance: bigint
    let srCID: CID
    let codeCID: CID

    if (node.Nonce == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.Nonce is null/undefined')
    } else if (typeof node.Nonce == 'string' || typeof node.Nonce == 'number') {
        nonce = BigInt(node.Nonce)
    } else if (typeof node.Nonce == 'bigint') {
        nonce = node.Nonce
    } else if (node.Nonce instanceof Uint8Array) {
        nonce = bufToBigInt(node.Nonce)
    } else {
        throw new TypeError('Invalid eth-account-snapshop form; node.Nonce needs to be of type bigint')
    }

    if (node.Balance == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.Balance is null/undefined')
    } else if (typeof node.Balance == 'string' || typeof node.Balance == 'number') {
        balance = BigInt(node.Balance)
    } else if (typeof node.Balance == 'bigint') {
        balance = node.Balance
    } else if (node.Balance instanceof Uint8Array) {
        balance = bufToBigInt(node.Balance)
    } else {
        throw new TypeError('Invalid eth-account-snapshop form; node.Balance needs to be of type bigint')
    }

    if (node.StorageRootCID == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.StorageRootCID is null/undefined')
    } else if (typeof node.StorageRootCID == 'string') {
        srCID = CID.parse(node.StorageRootCID)
    } else if (node.StorageRootCID instanceof Uint8Array) {
        srCID = CID.decode(node.StorageRootCID)
    } else if (CID.isCID(node.StorageRootCID)) {
        srCID = node.StorageRootCID
    } else {
        throw new TypeError('Invalid eth-account-snapshop form; node.StorageRootCID needs to be of type CID')
    }

    if (node.CodeCID == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.CodeCID is null/undefined')
    } else if (typeof node.CodeCID == 'string') {
        codeCID = CID.parse(node.CodeCID)
    } else if (node.CodeCID instanceof Uint8Array) {
        codeCID = CID.decode(node.CodeCID)
    } else if (CID.isCID(node.CodeCID)) {
        codeCID = node.CodeCID
    } else {
        throw new TypeError('Invalid eth-account-snapshop form; node.CodeCID needs to be of type CID')
    }

    return {
        Nonce: nonce,
        Balance: balance,
        StorageRootCID: srCID,
        CodeCID: codeCID,
    }
}

export function validate(node: Account) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
        throw new TypeError('Invalid eth-account-snapshop form')
    }

    if (!hasOnlyProperties(node, accountNodeProperties)) {
        throw new TypeError('Invalid eth-account-snapshop form (extraneous properties)')
    }

    if (node.Nonce == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.Nonce is null/undefined')
    } else if (typeof node.Nonce !== 'bigint') {
        throw new TypeError('Invalid eth-account-snapshop form; node.Nonce needs to be of type bigint')
    }

    if (node.Balance == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.Balance is null/undefined')
    } else if (typeof node.Balance !== 'bigint') {
        throw new TypeError('Invalid eth-account-snapshop form; node.Balance needs to be of type bigint')
    }

    if (node.StorageRootCID == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.StorageRootCID is null/undefined')
    } else if (!CID.isCID(node.StorageRootCID)) {
        throw new TypeError('Invalid eth-account-snapshop form; node.StorageRootCID needs to be of type CID')
    }

    if (node.CodeCID == null) {
        throw new TypeError('Invalid eth-account-snapshop form; node.CodeCID is null/undefined')
    } else if (!CID.isCID(node.CodeCID)) {
        throw new TypeError('Invalid eth-account-snapshop form; node.CodeCID needs to be of type CID')
    }
}

function bufToBigInt(buf: Uint8Array): bigint {
    let hex = []
    let u8 = Uint8Array.from(buf)

    u8.forEach(function (i) {
        var h = i.toString(16)
        if (h.length % 2) { h = '0' + h }
        hex.push(h)
    });

    return BigInt('0x' + hex.join(''))
}

function hasOnlyProperties(node: any, properties: string[]): boolean {
    return !Object.keys(node).some((p) => !properties.includes(p))
}