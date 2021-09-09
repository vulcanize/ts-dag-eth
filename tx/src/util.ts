import { CID } from 'multiformats/cid'
import { Transaction } from './interface'
import { arrayToNumber, bufferToNumber, arrayToBigInt, bufferToBigInt, hasOnlyProperties } from '../../util/src/util'
import { AccessListBuffer } from '@ethereumjs/tx'

const txNodeProperties = ['TxType',
  'ChainID', 'AccountNonce', 'GasPrice',
  'GasTipCap', 'GasFeeCap', 'GasLimit', 'Recipient',
  'Amount', 'Data', 'AccessList', 'V', 'R', 'S']

function prepareLegacyTx (node: any): Transaction {
  let accountNonce: bigint
  let gasPrice: bigint
  let gasLimit: bigint
  let receipient: Uint8Array | undefined
  let amount: bigint
  let data: Uint8Array
  let v: bigint
  let r: bigint
  let s: bigint

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-tx form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce === 'string' || typeof node.Nonce === 'bigint') {
    accountNonce = BigInt(node.Nonce)
  } else if (node.Nonce instanceof Uint8Array) {
    accountNonce = arrayToBigInt(node.Nonce)
  } else if (node.Nonce instanceof Buffer) {
    accountNonce = bufferToBigInt(node.Nonce)
  } else if (typeof node.Nonce === 'bigint') {
    accountNonce = node.Nonce
  } else {
    throw new TypeError('Invalid eth-tx form; node.Nonce needs to be of type bigint')
  }

  if (node.GasPrice == null) {
    throw new TypeError('Invalid eth-tx legacy form; node.GasPrice is null/undefined')
  } else if (typeof node.GasPrice === 'string' || typeof node.GasPrice === 'bigint') {
    gasPrice = BigInt(node.GasPrice)
  } else if (node.GasPrice instanceof Uint8Array) {
    gasPrice = arrayToBigInt(node.GasPrice)
  } else if (node.GasPrice instanceof Buffer) {
    gasPrice = bufferToBigInt(node.GasPrice)
  } else if (typeof node.GasPrice === 'bigint') {
    gasPrice = node.GasPrice
  } else {
    throw new TypeError('Invalid eth-tx legacy form; node.GasPrice needs to be of type bigint')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit === 'string' || typeof node.GasLimit === 'bigint') {
    gasLimit = BigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Uint8Array) {
    gasLimit = arrayToBigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Buffer) {
    gasLimit = bufferToBigInt(node.GasLimit)
  } else if (typeof node.GasLimit === 'bigint') {
    gasLimit = node.GasLimit
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type bigint')
  }

  if (node.Recipient == null) {
    receipient = undefined
  } else if (typeof node.Recipient === 'string') {
    receipient = Uint8Array.from(Buffer.from(node.Recipient, 'hex'))
  } else if (node.Recipient instanceof Uint8Array) {
    receipient = node.Recipient
  } else if (node.Recipient instanceof Buffer) {
    receipient = Uint8Array.from(node.Recipient)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Recipient needs to be of type Uint8Array')
  }

  if (node.Value == null) {
    throw new TypeError('Invalid eth-tx form; node.Value is null/undefined')
  } else if (typeof node.Value === 'string' || typeof node.Value === 'bigint') {
    amount = BigInt(node.Value)
  } else if (node.Value instanceof Uint8Array) {
    amount = arrayToBigInt(node.Value)
  } else if (node.Value instanceof Buffer) {
    amount = bufferToBigInt(node.Value)
  } else if (typeof node.Value === 'bigint') {
    amount = node.Value
  } else {
    throw new TypeError('Invalid eth-tx form; node.Value needs to be of type bigint')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-tx form; node.Data is null/undefined')
  } else if (typeof node.Data === 'string') {
    data = Uint8Array.from(Buffer.from(node.Data, 'hex'))
  } else if (node.Data instanceof Uint8Array) {
    data = node.Data
  } else if (node.Data instanceof Buffer) {
    data = Uint8Array.from(node.Data)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Data needs to be of type Uint8Array')
  }
}

function prepareAccessListTx (node: any): Transaction {
  let chainID: bigint
  let accountNonce: bigint
  let gasPrice: bigint
  let gasLimit: bigint
  let receipient: Uint8Array | undefined
  let amount: bigint
  let data: Uint8Array
  let accessList: AccessListBuffer
  let v: bigint
  let r: bigint
  let s: bigint

  if (node.ChainID == null) {
    throw new TypeError('Invalid eth-tx form; node.ChainID is null/undefined')
  } else if (typeof node.ChainID === 'string' || typeof node.ChainID === 'bigint') {
    chainID = BigInt(node.ChainID)
  } else if (node.ChainID instanceof Uint8Array) {
    chainID = arrayToBigInt(node.ChainID)
  } else if (node.ChainID instanceof Buffer) {
    chainID = bufferToBigInt(node.ChainID)
  } else if (typeof node.ChainID === 'bigint') {
    chainID = node.ChainID
  } else {
    throw new TypeError('Invalid eth-tx form; node.ChainID needs to be of type bigint')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-tx form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce === 'string' || typeof node.Nonce === 'bigint') {
    accountNonce = BigInt(node.Nonce)
  } else if (node.Nonce instanceof Uint8Array) {
    accountNonce = arrayToBigInt(node.Nonce)
  } else if (node.Nonce instanceof Buffer) {
    accountNonce = bufferToBigInt(node.Nonce)
  } else if (typeof node.Nonce === 'bigint') {
    accountNonce = node.Nonce
  } else {
    throw new TypeError('Invalid eth-tx form; node.Nonce needs to be of type bigint')
  }

  if (node.GasPrice == null) {
    throw new TypeError('Invalid eth-tx legacy form; node.GasPrice is null/undefined')
  } else if (typeof node.GasPrice === 'string' || typeof node.GasPrice === 'bigint') {
    gasPrice = BigInt(node.GasPrice)
  } else if (node.GasPrice instanceof Uint8Array) {
    gasPrice = arrayToBigInt(node.GasPrice)
  } else if (node.GasPrice instanceof Buffer) {
    gasPrice = bufferToBigInt(node.GasPrice)
  } else if (typeof node.GasPrice === 'bigint') {
    gasPrice = node.GasPrice
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasPrice needs to be of type bigint')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit === 'string' || typeof node.GasLimit === 'bigint') {
    gasLimit = BigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Uint8Array) {
    gasLimit = arrayToBigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Buffer) {
    gasLimit = bufferToBigInt(node.GasLimit)
  } else if (typeof node.GasLimit === 'bigint') {
    gasLimit = node.GasLimit
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type bigint')
  }

  if (node.Recipient == null) {
    receipient = undefined
  } else if (typeof node.Recipient === 'string') {
    receipient = Uint8Array.from(Buffer.from(node.Recipient, 'hex'))
  } else if (node.Recipient instanceof Uint8Array) {
    receipient = node.Recipient
  } else if (node.Recipient instanceof Buffer) {
    receipient = Uint8Array.from(node.Recipient)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Recipient needs to be of type Uint8Array')
  }

  if (node.Value == null) {
    throw new TypeError('Invalid eth-tx form; node.Value is null/undefined')
  } else if (typeof node.Value === 'string' || typeof node.Value === 'bigint') {
    amount = BigInt(node.Value)
  } else if (node.Value instanceof Uint8Array) {
    amount = arrayToBigInt(node.Value)
  } else if (node.Value instanceof Buffer) {
    amount = bufferToBigInt(node.Value)
  } else if (typeof node.Value === 'bigint') {
    amount = node.Value
  } else {
    throw new TypeError('Invalid eth-tx form; node.Value needs to be of type bigint')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-tx form; node.Data is null/undefined')
  } else if (typeof node.Data === 'string') {
    data = Uint8Array.from(Buffer.from(node.Data, 'hex'))
  } else if (node.Data instanceof Uint8Array) {
    data = node.Data
  } else if (node.Data instanceof Buffer) {
    data = Uint8Array.from(node.Data)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Data needs to be of type Uint8Array')
  }
}

function prepareFeeMarketTx (node: any): Transaction {
  let chainID: bigint
  let accountNonce: bigint
  let gasTipCap: bigint
  let gasFeeCap: bigint
  let gasLimit: bigint
  let receipient: Uint8Array | undefined
  let amount: bigint
  let data: Uint8Array
  let accessList: AccessListBuffer
  let v: bigint
  let r: bigint
  let s: bigint

  if (node.ChainID == null) {
    throw new TypeError('Invalid eth-tx form; node.ChainID is null/undefined')
  } else if (typeof node.ChainID === 'string' || typeof node.ChainID === 'bigint') {
    chainID = BigInt(node.ChainID)
  } else if (node.ChainID instanceof Uint8Array) {
    chainID = arrayToBigInt(node.ChainID)
  } else if (node.ChainID instanceof Buffer) {
    chainID = bufferToBigInt(node.ChainID)
  } else if (typeof node.ChainID === 'bigint') {
    chainID = node.ChainID
  } else {
    throw new TypeError('Invalid eth-tx form; node.ChainID needs to be of type bigint')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-tx form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce === 'string' || typeof node.Nonce === 'bigint') {
    accountNonce = BigInt(node.Nonce)
  } else if (node.Nonce instanceof Uint8Array) {
    accountNonce = arrayToBigInt(node.Nonce)
  } else if (node.Nonce instanceof Buffer) {
    accountNonce = bufferToBigInt(node.Nonce)
  } else if (typeof node.Nonce === 'bigint') {
    accountNonce = node.Nonce
  } else {
    throw new TypeError('Invalid eth-tx form; node.Nonce needs to be of type bigint')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit === 'string' || typeof node.GasLimit === 'bigint') {
    gasLimit = BigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Uint8Array) {
    gasLimit = arrayToBigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Buffer) {
    gasLimit = bufferToBigInt(node.GasLimit)
  } else if (typeof node.GasLimit === 'bigint') {
    gasLimit = node.GasLimit
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type bigint')
  }

  if (node.Recipient == null) {
    receipient = undefined
  } else if (typeof node.Recipient === 'string') {
    receipient = Uint8Array.from(Buffer.from(node.Recipient, 'hex'))
  } else if (node.Recipient instanceof Uint8Array) {
    receipient = node.Recipient
  } else if (node.Recipient instanceof Buffer) {
    receipient = Uint8Array.from(node.Recipient)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Recipient needs to be of type Uint8Array')
  }

  if (node.Value == null) {
    throw new TypeError('Invalid eth-tx form; node.Value is null/undefined')
  } else if (typeof node.Value === 'string' || typeof node.Value === 'bigint') {
    amount = BigInt(node.Value)
  } else if (node.Value instanceof Uint8Array) {
    amount = arrayToBigInt(node.Value)
  } else if (node.Value instanceof Buffer) {
    amount = bufferToBigInt(node.Value)
  } else if (typeof node.Value === 'bigint') {
    amount = node.Value
  } else {
    throw new TypeError('Invalid eth-tx form; node.Value needs to be of type bigint')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-tx form; node.Data is null/undefined')
  } else if (typeof node.Data === 'string') {
    data = Uint8Array.from(Buffer.from(node.Data, 'hex'))
  } else if (node.Data instanceof Uint8Array) {
    data = node.Data
  } else if (node.Data instanceof Buffer) {
    data = Uint8Array.from(node.Data)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Data needs to be of type Uint8Array')
  }
}

export function prepare (node: any): Transaction {
  if (typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx form')
  }

  /*
  /*
export interface Transaction {
    TxType: number,
    ChainID?: bigint,
    AccountNonce: bigint,
    GasPrice?: bigint,
    GasTipCap?: bigint,
    GasFeeCap?: bigint,
    GasLimit: bigint,
    Recipient?: Uint8Array,
    Amount: bigint,
    Data: Uint8Array,
    AccessList?: AccessListBuffer,
    V: bigint,
    R: bigint,
    S: bigint
}
 */
  let txType: number

  if (node.TxType == null) {
    throw new TypeError('Invalid eth-tx form; node.TxType is null/undefined')
  } else if (typeof node.TxType === 'string' || typeof node.TxType === 'bigint') {
    txType = Number(node.TxType)
  } else if (node.TxType instanceof Uint8Array) {
    txType = arrayToNumber(node.TxType)
  } else if (node.TxType instanceof Buffer) {
    txType = bufferToNumber(node.TxType)
  } else if (typeof node.TxType === 'number') {
    txType = node.TxType
  } else {
    throw new TypeError('Invalid eth-tx form; node.TxType needs to be of type number')
  }

  switch (txType) {
    case 0:
      return prepareLegacyTx(node)
    case 1:
      return prepareAccessListTx(node)
    case 2:
      return prepareFeeMarketTx(node)
    default:
      throw Error(`unrecognized TxType: ${txType}`)
  }

  if (node.UnclesCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (typeof node.UnclesCID === 'string') {
    unclesCID = CID.parse(node.UnclesCID)
  } else if (node.UnclesCID instanceof Uint8Array) {
    unclesCID = CID.decode(node.UnclesCID)
  } else if (node.UnclesCID instanceof Buffer) {
    unclesCID = CID.decode(Uint8Array.from(node.UnclesCID))
  } else if (CID.isCID(node.UnclesCID)) {
    unclesCID = node.UnclesCID
  } else {
    throw new TypeError('Invalid eth-tx form; node.UnclesCID needs to be of type CID')
  }

  if (node.ChainID == null) {
    throw new TypeError('Invalid eth-tx form; node.Coinbase is null/undefined')
  } else if (typeof node.Coinbase === 'string') {
    coinbase = Uint8Array.from(Buffer.from(node.Coinbase, 'hex'))
  } else if (node.Coinbase instanceof Uint8Array) {
    coinbase = node.Coinbase
  } else if (node.Coinbase instanceof Buffer) {
    coinbase = Uint8Array.from(node.Coinbase)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Coinbase needs to be of type Uint8Array')
  }

  if (node.StateRootCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (typeof node.StateRootCID === 'string') {
    stateCID = CID.parse(node.StateRootCID)
  } else if (node.StateRootCID instanceof Uint8Array) {
    stateCID = CID.decode(node.StateRootCID)
  } else if (node.StateRootCID instanceof Buffer) {
    stateCID = CID.decode(Uint8Array.from(node.StateRootCID))
  } else if (CID.isCID(node.StateRootCID)) {
    stateCID = node.StateRootCID
  } else {
    throw new TypeError('Invalid eth-tx form; node.StateRootCID needs to be of type CID')
  }

  if (node.TxRootCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (typeof node.TxRootCID === 'string') {
    txCID = CID.parse(node.TxRootCID)
  } else if (node.TxRootCID instanceof Uint8Array) {
    txCID = CID.decode(node.TxRootCID)
  } else if (node.TxRootCID instanceof Buffer) {
    txCID = CID.decode(Uint8Array.from(node.TxRootCID))
  } else if (CID.isCID(node.TxRootCID)) {
    txCID = node.TxRootCID
  } else {
    throw new TypeError('Invalid eth-tx form; node.TxRootCID needs to be of type CID')
  }

  if (node.RctRootCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (typeof node.RctRootCID === 'string') {
    rctCID = CID.parse(node.RctRootCID)
  } else if (node.RctRootCID instanceof Uint8Array) {
    rctCID = CID.decode(node.RctRootCID)
  } else if (node.RctRootCID instanceof Buffer) {
    rctCID = CID.decode(Uint8Array.from(node.RctRootCID))
  } else if (CID.isCID(node.RctRootCID)) {
    rctCID = node.RctRootCID
  } else {
    throw new TypeError('Invalid eth-tx form; node.RctRootCID needs to be of type CID')
  }

  if (node.Bloom == null) {
    throw new TypeError('Invalid eth-tx form; node.Bloom is null/undefined')
  } else if (typeof node.Bloom === 'string') {
    bloom = Uint8Array.from(Buffer.from(node.Bloom, 'hex'))
  } else if (node.Bloom instanceof Uint8Array) {
    bloom = node.Bloom
  } else if (node.Bloom instanceof Buffer) {
    bloom = Uint8Array.from(node.Bloom)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Bloom needs to be of type Uint8Array')
  }

  if (node.Difficulty == null) {
    throw new TypeError('Invalid eth-tx form; node.Difficulty is null/undefined')
  } else if (typeof node.Difficulty === 'string' || typeof node.Difficulty === 'number') {
    diff = BigInt(node.Difficulty)
  } else if (typeof node.Difficulty === 'bigint') {
    diff = node.Difficulty
  } else if (node.Difficulty instanceof Uint8Array) {
    diff = arrayToBigInt(node.Difficulty)
  } else if (node.Difficulty instanceof Buffer) {
    diff = bufferToBigInt(node.Difficulty)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Difficulty needs to be of type bigint')
  }

  if (node.Number == null) {
    throw new TypeError('Invalid eth-tx form; node.Number is null/undefined')
  } else if (typeof node.Number === 'string' || typeof node.Number === 'number') {
    number = BigInt(node.Number)
  } else if (typeof node.Number === 'bigint') {
    number = node.Number
  } else if (node.Number instanceof Uint8Array) {
    number = arrayToBigInt(node.Number)
  } else if (node.Number instanceof Buffer) {
    number = bufferToBigInt(node.Number)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Number needs to be of type bigint')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit === 'string' || typeof node.GasLimit === 'number') {
    gasLimit = BigInt(node.GasLimit)
  } else if (typeof node.GasLimit === 'bigint') {
    gasLimit = node.GasLimit
  } else if (node.GasLimit instanceof Uint8Array) {
    gasLimit = arrayToBigInt(node.GasLimit)
  } else if (node.GasLimit instanceof Buffer) {
    gasLimit = bufferToBigInt(node.GasLimit)
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type bigint')
  }

  if (node.GasUsed == null) {
    throw new TypeError('Invalid eth-tx form; node.GasUsed is null/undefined')
  } else if (typeof node.GasUsed === 'string' || typeof node.GasUsed === 'number') {
    gasUsed = BigInt(node.GasUsed)
  } else if (typeof node.GasUsed === 'bigint') {
    gasUsed = node.GasUsed
  } else if (node.GasUsed instanceof Uint8Array) {
    gasUsed = arrayToBigInt(node.GasUsed)
  } else if (node.GasUsed instanceof Buffer) {
    gasUsed = bufferToBigInt(node.GasUsed)
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasUsed needs to be of type bigint')
  }

  if (node.Time == null) {
    throw new TypeError('Invalid eth-tx form; node.Time is null/undefined')
  } else if (typeof node.Time === 'string' || typeof node.Time === 'bigint') {
    timestamp = Number(node.Time)
  } else if (node.Time instanceof Uint8Array) {
    timestamp = arrayToNumber(node.Time)
  } else if (node.Time instanceof Buffer) {
    timestamp = bufferToNumber(node.Time)
  } else if (typeof node.Time === 'number') {
    timestamp = node.Time
  } else {
    throw new TypeError('Invalid eth-tx form; node.Time needs to be of type number')
  }

  if (node.Extra == null) {
    throw new TypeError('Invalid eth-tx form; node.Extra is null/undefined')
  } else if (typeof node.Extra === 'string') {
    extraData = Uint8Array.from(Buffer.from(node.Extra, 'hex'))
  } else if (node.Extra instanceof Uint8Array) {
    extraData = node.Extra
  } else if (node.Extra instanceof Buffer) {
    extraData = Uint8Array.from(node.Extra)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Extra needs to be of type Uint8Array')
  }

  if (node.MixDigest == null) {
    throw new TypeError('Invalid eth-tx form; node.Extra is null/undefined')
  } else if (typeof node.MixDigest === 'string') {
    mixHash = Uint8Array.from(Buffer.from(node.MixDigest, 'hex'))
  } else if (node.MixDigest instanceof Uint8Array) {
    mixHash = node.MixDigest
  } else if (node.MixDigest instanceof Buffer) {
    mixHash = Uint8Array.from(node.MixDigest)
  } else {
    throw new TypeError('Invalid eth-tx form; node.MixDigest needs to be of type Uint8Array')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-tx form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce === 'string' || typeof node.Nonce === 'number') {
    nonce = BigInt(node.Nonce)
  } else if (typeof node.Nonce === 'bigint') {
    nonce = node.Nonce
  } else if (node.Nonce instanceof Uint8Array) {
    nonce = arrayToBigInt(node.Nonce)
  } else if (node.Nonce instanceof Buffer) {
    nonce = bufferToBigInt(node.Nonce)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Nonce needs to be of type bigint')
  }

  if (node.BaseFee == null) {
    throw new TypeError('Invalid eth-tx form; node.BaseFee is null/undefined')
  } else if (typeof node.BaseFee === 'string' || typeof node.BaseFee === 'number') {
    baseFeePerGas = BigInt(node.BaseFee)
  } else if (typeof node.BaseFee === 'bigint') {
    baseFeePerGas = node.BaseFee
  } else if (node.BaseFee instanceof Uint8Array) {
    baseFeePerGas = arrayToBigInt(node.BaseFee)
  } else if (node.BaseFee instanceof Buffer) {
    baseFeePerGas = bufferToBigInt(node.BaseFee)
  } else {
    throw new TypeError('Invalid eth-tx form; node.BaseFee needs to be of type bigint')
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
    throw new TypeError('Invalid eth-tx form')
  }

  if (!hasOnlyProperties(node, txNodeProperties)) {
    throw new TypeError('Invalid eth-tx form (extraneous properties)')
  }

  if (node.ParentCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (!CID.isCID(node.ParentCID)) {
    throw new TypeError('Invalid eth-tx form; node.ParentCID needs to be of type CID')
  }

  if (node.UnclesCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (!CID.isCID(node.UnclesCID)) {
    throw new TypeError('Invalid eth-tx form; node.UnclesCID needs to be of type CID')
  }

  if (node.Coinbase == null) {
    throw new TypeError('Invalid eth-tx form; node.Coinbase is null/undefined')
  } else if (!(node.Coinbase instanceof Uint8Array)) {
    throw new TypeError('Invalid eth-tx form; node.Coinbase needs to be of type Uint8Array')
  }

  if (node.StateRootCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (!CID.isCID(node.StateRootCID)) {
    throw new TypeError('Invalid eth-tx form; node.StateRootCID needs to be of type CID')
  }

  if (node.TxRootCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (!CID.isCID(node.TxRootCID)) {
    throw new TypeError('Invalid eth-tx form; node.TxRootCID needs to be of type CID')
  }

  if (node.RctRootCID == null) {
    throw new TypeError('Invalid eth-tx form; node.parentHash is null/undefined')
  } else if (!CID.isCID(node.RctRootCID)) {
    throw new TypeError('Invalid eth-tx form; node.RctRootCID needs to be of type CID')
  }

  if (node.Bloom == null) {
    throw new TypeError('Invalid eth-tx form; node.Bloom is null/undefined')
  } else if (!(node.Bloom instanceof Uint8Array)) {
    throw new TypeError('Invalid eth-tx form; node.Bloom needs to be of type Uint8Array')
  }

  if (node.Difficulty == null) {
    throw new TypeError('Invalid eth-tx form; node.Difficulty is null/undefined')
  } else if (typeof node.Difficulty !== 'bigint') {
    throw new TypeError('Invalid eth-tx form; node.Difficulty needs to be of type bigint')
  }

  if (node.Number == null) {
    throw new TypeError('Invalid eth-tx form; node.Number is null/undefined')
  } else if (typeof node.Number !== 'bigint') {
    throw new TypeError('Invalid eth-tx form; node.Number needs to be of type bigint')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit !== 'bigint') {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type bigint')
  }

  if (node.GasUsed == null) {
    throw new TypeError('Invalid eth-tx form; node.GasUsed is null/undefined')
  } else if (typeof node.GasUsed !== 'bigint') {
    throw new TypeError('Invalid eth-tx form; node.GasUsed needs to be of type bigint')
  }

  if (node.Time == null) {
    throw new TypeError('Invalid eth-tx form; node.Time is null/undefined')
  } else if (typeof node.Time !== 'number') {
    throw new TypeError('Invalid eth-tx form; node.Time needs to be of type number')
  }

  if (node.Extra == null) {
    throw new TypeError('Invalid eth-tx form; node.Extra is null/undefined')
  } else if (!(node.Extra instanceof Uint8Array)) {
    throw new TypeError('Invalid eth-tx form; node.Extra needs to be of type Uint8Array')
  }

  if (node.MixDigest == null) {
    throw new TypeError('Invalid eth-tx form; node.Extra is null/undefined')
  } else if (!(node.MixDigest instanceof Uint8Array)) {
    throw new TypeError('Invalid eth-tx form; node.MixDigest needs to be of type Uint8Array')
  }

  if (node.Nonce == null) {
    throw new TypeError('Invalid eth-tx form; node.Nonce is null/undefined')
  } else if (typeof node.Nonce !== 'bigint') {
    throw new TypeError('Invalid eth-tx form; node.Nonce needs to be of type bigint')
  }

  if (node.BaseFee == null) {
    throw new TypeError('Invalid eth-tx form; node.BaseFee is null/undefined')
  } else if (typeof node.BaseFee !== 'bigint') {
    throw new TypeError('Invalid eth-tx form; node.BaseFee needs to be of type bigint')
  }
}
