import { CID } from 'multiformats/cid'
import { Header, isHeader } from './interface'
import BN from 'bn.js'
import { Address } from 'ethereumjs-util'
const toBuffer = require('typedarray-to-buffer')

export function prepare (node: any): Header {
  if (typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-block form')
  }

  let parentCID: CID
  let unclesCID: CID
  let coinbase: Address
  let stateCID: CID
  let txCID: CID
  let rctCID: CID
  let bloom: Buffer
  let diff: BN
  let number: BN
  let gasLimit: BN
  let gasUsed: BN
  let timestamp: BN
  let extraData: Buffer
  let mixHash: Buffer
  let nonce: Buffer
  let baseFeePerGas: BN | undefined

  if (node.ParentCID == null) {
    throw new TypeError('Invalid eth-block form; node.ParentCID is null/undefined')
  } else if (typeof node.ParentCID === 'string') {
    parentCID = CID.parse(node.ParentCID)
  } else if (node.ParentCID instanceof Uint8Array || node.ParentCID instanceof Buffer) {
    parentCID = CID.decode(node.ParentCID)
  } else if (CID.isCID(node.ParentCID)) {
    parentCID = node.ParentCID
  } else {
    throw new TypeError('Invalid eth-block form; node.ParentCID needs to be of type CID')
  }

  if (node.UnclesCID == null) {
    throw new TypeError('Invalid eth-block form; node.UnclesCID is null/undefined')
  } else if (typeof node.UnclesCID === 'string') {
    unclesCID = CID.parse(node.UnclesCID)
  } else if (node.UnclesCID instanceof Uint8Array || node.UnclesCID instanceof Buffer) {
    unclesCID = CID.decode(node.UnclesCID)
  } else if (CID.isCID(node.UnclesCID)) {
    unclesCID = node.UnclesCID
  } else {
    throw new TypeError('Invalid eth-block form; node.UnclesCID needs to be of type CID')
  }

  if (node.Coinbase == null) {
    throw new TypeError('Invalid eth-block form; node.Coinbase is null/undefined')
  } else if (typeof node.Coinbase === 'string') {
    coinbase = Address.fromString(node.Coinbase)
  } else if (node.Coinbase instanceof Uint8Array || (Array.isArray(node.Coinbase) && node.Coinbase.every((item: any) => typeof item === 'number'))) {
    coinbase = new Address(toBuffer(node.Coinbase))
  } else if (node.Coinbase instanceof Buffer) {
    coinbase = new Address(node.Coinbase)
  } else if (node.Coinbase instanceof Address) {
    coinbase = node.Coinbase
  } else {
    throw new TypeError('Invalid eth-block form; node.Coinbase needs to be of type Address')
  }

  if (node.StateRootCID == null) {
    throw new TypeError('Invalid eth-block form; node.StateRootCID is null/undefined')
  } else if (typeof node.StateRootCID === 'string') {
    stateCID = CID.parse(node.StateRootCID)
  } else if (node.StateRootCID instanceof Uint8Array || node.StateRootCID instanceof Buffer) {
    stateCID = CID.decode(node.StateRootCID)
  } else if (CID.isCID(node.StateRootCID)) {
    stateCID = node.StateRootCID
  } else {
    throw new TypeError('Invalid eth-block form; node.StateRootCID needs to be of type CID')
  }

  if (node.TxRootCID == null) {
    throw new TypeError('Invalid eth-block form; node.TxRootCID is null/undefined')
  } else if (typeof node.TxRootCID === 'string') {
    txCID = CID.parse(node.TxRootCID)
  } else if (node.TxRootCID instanceof Uint8Array || node.TxRootCID instanceof Buffer) {
    txCID = CID.decode(node.TxRootCID)
  } else if (CID.isCID(node.TxRootCID)) {
    txCID = node.TxRootCID
  } else {
    throw new TypeError('Invalid eth-block form; node.TxRootCID needs to be of type CID')
  }

  if (node.RctRootCID == null) {
    throw new TypeError('Invalid eth-block form; node.RctRootCID is null/undefined')
  } else if (typeof node.RctRootCID === 'string') {
    rctCID = CID.parse(node.RctRootCID)
  } else if (node.RctRootCID instanceof Uint8Array || node.RctRootCID instanceof Buffer) {
    rctCID = CID.decode(node.RctRootCID)
  } else if (CID.isCID(node.RctRootCID)) {
    rctCID = node.RctRootCID
  } else {
    throw new TypeError('Invalid eth-block form; node.RctRootCID needs to be of type CID')
  }

  if (node.Bloom == null) {
    throw new TypeError('Invalid eth-block form; node.Bloom is null/undefined')
  } else if (typeof node.Bloom === 'string') {
    bloom = Buffer.from(node.Bloom, 'hex')
  } else if (node.Bloom instanceof Uint8Array || (Array.isArray(node.Bloom) && node.Bloom.every((item: any) => typeof item === 'number'))) {
    bloom = toBuffer(node.Bloom)
  } else if (node.Bloom instanceof Buffer) {
    bloom = node.Bloom
  } else {
    throw new TypeError('Invalid eth-block form; node.Bloom needs to be of type Buffer')
  }

  if (node.Difficulty == null) {
    throw new TypeError('Invalid eth-block form; node.Difficulty is null/undefined')
  } else if (typeof node.Difficulty === 'string' || typeof node.Difficulty === 'number' || node.Difficulty instanceof Uint8Array ||
    node.Difficulty instanceof Buffer) {
    diff = new BN(node.Difficulty, 10)
  } else if (typeof node.Difficulty === 'bigint') {
    diff = new BN(node.Difficulty.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-block form; node.Difficulty needs to be of type BN')
  }

  if (node.Number == null) {
    throw new TypeError('Invalid eth-block form; node.Number is null/undefined')
  } else if (typeof node.Number === 'string' || typeof node.Number === 'number' || node.Number instanceof Uint8Array ||
    node.Number instanceof Buffer) {
    number = new BN(node.Number, 10)
  } else if (typeof node.Number === 'bigint') {
    number = new BN(node.Number.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-block form; node.Number needs to be of type BN')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-block form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit === 'string' || typeof node.GasLimit === 'number' || node.GasLimit instanceof Uint8Array ||
    node.GasLimit instanceof Buffer) {
    gasLimit = new BN(node.GasLimit, 10)
  } else if (typeof node.GasLimit === 'bigint') {
    gasLimit = new BN(node.GasLimit.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-block form; node.GasLimit needs to be of type BN')
  }

  if (node.GasUsed == null) {
    throw new TypeError('Invalid eth-block form; node.GasUsed is null/undefined')
  } else if (typeof node.GasUsed === 'string' || typeof node.GasUsed === 'number' || node.GasUsed instanceof Uint8Array ||
    node.GasUsed instanceof Buffer) {
    gasUsed = new BN(node.GasUsed, 10)
  } else if (typeof node.GasUsed === 'bigint') {
    gasUsed = new BN(node.GasUsed.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-block form; node.GasUsed needs to be of type BN')
  }

  if (node.Time == null) {
    throw new TypeError('Invalid eth-block form; node.Time is null/undefined')
  } else if (typeof node.Time === 'string' || typeof node.Time === 'number' || node.Time instanceof Uint8Array ||
    node.Time instanceof Buffer) {
    timestamp = new BN(node.Time, 10)
  } else if (typeof node.Time === 'bigint') {
    timestamp = new BN(node.Time.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-block form; node.Time needs to be of type BN')
  }

  if (node.Extra == null) {
    throw new TypeError('Invalid eth-block form; node.Extra is null/undefined')
  } else if (typeof node.Extra === 'string') {
    extraData = Buffer.from(node.Extra, 'hex')
  } else if (node.Extra instanceof Uint8Array || (Array.isArray(node.Extra) && node.Extra.every((item: any) => typeof item === 'number'))) {
    extraData = toBuffer(node.Extra)
  } else if (node.Extra instanceof Buffer) {
    extraData = node.Extra
  } else {
    throw new TypeError('Invalid eth-block form; node.Extra needs to be of type Buffer')
  }

  if (node.MixDigest == null) {
    throw new TypeError('Invalid eth-block form; node.MixDigest is null/undefined')
  } else if (typeof node.MixDigest === 'string') {
    mixHash = Buffer.from(node.MixDigest, 'hex')
  } else if (node.MixDigest instanceof Uint8Array || (Array.isArray(node.MixDigest) && node.MixDigest.every((item: any) => typeof item === 'number'))) {
    mixHash = toBuffer(node.MixDigest)
  } else if (node.MixDigest instanceof Buffer) {
    mixHash = node.MixDigest
  } else {
    throw new TypeError('Invalid eth-block form; node.MixDigest needs to be of type Buffer')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-block form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce === 'string') {
    nonce = Buffer.from(node.Nonce, 'hex')
  } else if (node.Nonce instanceof Uint8Array || (Array.isArray(node.Nonce) && node.Nonce.every((item: any) => typeof item === 'number'))) {
    nonce = toBuffer(node.Nonce)
  } else if (node.Nonce instanceof Buffer) {
    nonce = node.Nonce
  } else {
    throw new TypeError('Invalid eth-block form; node.Nonce needs to be of type Buffer')
  }

  if (node.BaseFee == null) {
    baseFeePerGas = undefined
  } else if (typeof node.BaseFee === 'string' || typeof node.BaseFee === 'number' || node.BaseFee instanceof Uint8Array ||
    node.BaseFee instanceof Buffer) {
    baseFeePerGas = new BN(node.BaseFee, 10)
  } else if (typeof node.BaseFee === 'bigint') {
    baseFeePerGas = new BN(node.BaseFee.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-block form; node.BaseFee needs to be of type BN')
  }

  return {
    ParentCID: parentCID,
    UnclesCID: unclesCID,
    Coinbase: coinbase,
    StateRootCID: stateCID,
    TxRootCID: txCID,
    RctRootCID: rctCID,
    Bloom: bloom,
    Difficulty: diff,
    Number: number,
    GasLimit: gasLimit,
    GasUsed: gasUsed,
    Time: timestamp,
    Extra: extraData,
    MixDigest: mixHash,
    Nonce: nonce,
    BaseFee: baseFeePerGas
  }
}

export function validate (node: Header) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-block form')
  }

  if (!isHeader(node)) {
    throw new TypeError('Invalid eth-block form')
  }

  if (node.ParentCID == null) {
    throw new TypeError('Invalid eth-block form; node.ParentCID is null/undefined')
  } else if (!CID.isCID(node.ParentCID)) {
    throw new TypeError('Invalid eth-block form; node.ParentCID needs to be of type CID')
  }

  if (node.UnclesCID == null) {
    throw new TypeError('Invalid eth-block form; node.UnclesCID is null/undefined')
  } else if (!CID.isCID(node.UnclesCID)) {
    throw new TypeError('Invalid eth-block form; node.UnclesCID needs to be of type CID')
  }

  if (node.Coinbase == null) {
    throw new TypeError('Invalid eth-block form; node.Coinbase is null/undefined')
  } else if (!(node.Coinbase instanceof Address)) {
    throw new TypeError('Invalid eth-block form; node.Coinbase needs to be of type Address')
  }

  if (node.StateRootCID == null) {
    throw new TypeError('Invalid eth-block form; node.StateRootCID is null/undefined')
  } else if (!CID.isCID(node.StateRootCID)) {
    throw new TypeError('Invalid eth-block form; node.StateRootCID needs to be of type CID')
  }

  if (node.TxRootCID == null) {
    throw new TypeError('Invalid eth-block form; node.TxRootCID is null/undefined')
  } else if (!CID.isCID(node.TxRootCID)) {
    throw new TypeError('Invalid eth-block form; node.TxRootCID needs to be of type CID')
  }

  if (node.RctRootCID == null) {
    throw new TypeError('Invalid eth-block form; node.RctRootCID is null/undefined')
  } else if (!CID.isCID(node.RctRootCID)) {
    throw new TypeError('Invalid eth-block form; node.RctRootCID needs to be of type CID')
  }

  if (node.Bloom == null) {
    throw new TypeError('Invalid eth-block form; node.Bloom is null/undefined')
  } else if (!(node.Bloom instanceof Buffer)) {
    throw new TypeError('Invalid eth-block form; node.Bloom needs to be of type Buffer')
  }

  if (node.Difficulty == null) {
    throw new TypeError('Invalid eth-block form; node.Difficulty is null/undefined')
  } else if (!(node.Difficulty instanceof BN)) {
    throw new TypeError('Invalid eth-block form; node.Difficulty needs to be of type BN')
  }

  if (node.Number == null) {
    throw new TypeError('Invalid eth-block form; node.Number is null/undefined')
  } else if (!(node.Number instanceof BN)) {
    throw new TypeError('Invalid eth-block form; node.Number needs to be of type BN')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-block form; node.GasLimit is null/undefined')
  } else if (!(node.GasLimit instanceof BN)) {
    throw new TypeError('Invalid eth-block form; node.GasLimit needs to be of type BN')
  }

  if (node.GasUsed == null) {
    throw new TypeError('Invalid eth-block form; node.GasUsed is null/undefined')
  } else if (!(node.GasUsed instanceof BN)) {
    throw new TypeError('Invalid eth-block form; node.GasUsed needs to be of type BN')
  }

  if (node.Time == null) {
    throw new TypeError('Invalid eth-block form; node.Time is null/undefined')
  } else if (!(node.Time instanceof BN)) {
    throw new TypeError('Invalid eth-block form; node.Time needs to be of type BN')
  }

  if (node.Extra == null) {
    throw new TypeError('Invalid eth-block form; node.Extra is null/undefined')
  } else if (!(node.Extra instanceof Buffer)) {
    throw new TypeError('Invalid eth-block form; node.Extra needs to be of type Buffer')
  }

  if (node.MixDigest == null) {
    throw new TypeError('Invalid eth-block form; node.MixDigest is null/undefined')
  } else if (!(node.MixDigest instanceof Buffer)) {
    throw new TypeError('Invalid eth-block form; node.MixDigest needs to be of type Buffer')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-block form; node.Nonce is null/undefined')
  } else if (!(node.Nonce instanceof BN)) {
    throw new TypeError('Invalid eth-block form; node.Nonce needs to be of type BN')
  }

  if (node.BaseFee === null) {
    throw new TypeError('Invalid eth-block form; node.BaseFee is null')
  } else if (!(node.BaseFee instanceof BN) && typeof node.BaseFee !== 'undefined') {
    throw new TypeError('Invalid eth-block form; node.BaseFee needs to be of type BN or undefined')
  }
}
