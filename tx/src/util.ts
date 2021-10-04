import { Transaction } from './interface'
import { arrayToNumber, bufferToNumber, hasOnlyProperties } from '../../util/src/util'
import BN from 'bn.js'
import { Address } from 'ethereumjs-util'
const toBuffer = require('typedarray-to-buffer')

const txNodeProperties = ['TxType',
  'ChainID', 'AccountNonce', 'GasPrice',
  'GasTipCap', 'GasFeeCap', 'GasLimit', 'Recipient',
  'Amount', 'Data', 'AccessList', 'V', 'R', 'S']

function prepareBaseFields (node: any, txType: number): Transaction {
  let accountNonce: BN
  let gasLimit: BN
  let recipient: Address | undefined
  let amount: BN
  let data: Buffer
  let v: BN
  let r: BN
  let s: BN

  if (node.AccountNonce == null) {
    throw new TypeError('Invalid eth-tx form; node.AccountNonce is null/undefined')
  } else if (typeof node.AccountNonce === 'string' || typeof node.AccountNonce === 'number' || node.AccountNonce instanceof Uint8Array ||
    node.AccountNonce instanceof Buffer) {
    accountNonce = new BN(node.AccountNonce, 10)
  } else if (typeof node.AccountNonce === 'bigint') {
    accountNonce = new BN(node.AccountNonce.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.AccountNonce needs to be of type BN')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (typeof node.GasLimit === 'string' || typeof node.GasLimit === 'number' || node.GasLimit instanceof Uint8Array ||
    node.GasLimit instanceof Buffer) {
    gasLimit = new BN(node.GasLimit, 10)
  } else if (typeof node.GasLimit === 'bigint') {
    gasLimit = new BN(node.GasLimit.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type BN')
  }

  if (node.Recipient == null) {
    recipient = undefined
  } else if (typeof node.Recipient === 'string') {
    recipient = Address.fromString(node.Recipient)
  } else if (node.Recipient instanceof Uint8Array) {
    recipient = new Address(node.Recipient.buffer)
  } else if (node.Recipient instanceof Buffer) {
    recipient = new Address(node.Recipient)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Recipient needs to be of type Address or undefined')
  }

  if (node.Value == null) {
    throw new TypeError('Invalid eth-tx form; node.Value is null/undefined')
  } else if (typeof node.Value === 'string' || typeof node.Value === 'number' || node.Value instanceof Uint8Array ||
    node.Value instanceof Buffer) {
    amount = new BN(node.Value, 10)
  } else if (typeof node.Value === 'bigint') {
    amount = new BN(node.Value.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.Value needs to be of type BN')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-tx form; node.Data is null/undefined')
  } else if (typeof node.Data === 'string') {
    data = Buffer.from(node.Data, 'hex')
  } else if (node.Data instanceof Uint8Array) {
    data = toBuffer(node.Data)
  } else if (node.Data instanceof Buffer) {
    data = node.Data
  } else {
    throw new TypeError('Invalid eth-tx form; node.Data needs to be of type Buffer')
  }

  if (node.V == null) {
    throw new TypeError('Invalid eth-tx form; node.V is null/undefined')
  } else if (typeof node.V === 'string' || typeof node.V === 'number' || node.V instanceof Uint8Array ||
    node.V instanceof Buffer) {
    v = new BN(node.V, 10)
  } else if (typeof node.V === 'bigint') {
    v = new BN(node.V.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.V needs to be of type BN')
  }

  if (node.R == null) {
    throw new TypeError('Invalid eth-tx form; node.R is null/undefined')
  } else if (typeof node.R === 'string' || typeof node.R === 'number' || node.R instanceof Uint8Array ||
    node.R instanceof Buffer) {
    r = new BN(node.R, 10)
  } else if (typeof node.R === 'bigint') {
    r = new BN(node.R.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.R needs to be of type BN')
  }

  if (node.S == null) {
    throw new TypeError('Invalid eth-tx form; node.S is null/undefined')
  } else if (typeof node.S === 'string' || typeof node.S === 'number' || node.S instanceof Uint8Array ||
    node.S instanceof Buffer) {
    s = new BN(node.S, 10)
  } else if (typeof node.S === 'bigint') {
    s = new BN(node.S.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.S needs to be of type BN')
  }

  return {
    TxType: txType,
    AccountNonce: accountNonce,
    GasLimit: gasLimit,
    Recipient: recipient,
    Amount: amount,
    Data: data,
    V: v,
    R: r,
    S: s
  }
}

function prepareGasPrice (node: any): BN {
  let gasPrice: BN

  if (node.GasPrice == null) {
    throw new TypeError('Invalid eth-tx form; node.GasPrice is null/undefined')
  } else if (typeof node.GasPrice === 'string' || typeof node.GasPrice === 'number' || node.GasPrice instanceof Uint8Array ||
    node.GasPrice instanceof Buffer) {
    gasPrice = new BN(node.GasPrice, 10)
  } else if (typeof node.GasPrice === 'bigint') {
    gasPrice = new BN(node.GasPrice.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasPrice needs to be of type BN')
  }

  return gasPrice
}

function prepareChainID (node: any): BN {
  let chainID: BN

  if (node.ChainID == null) {
    throw new TypeError('Invalid eth-tx form; node.ChainID is null/undefined')
  } else if (typeof node.ChainID === 'string' || typeof node.ChainID === 'number' || node.ChainID instanceof Uint8Array ||
    node.ChainID instanceof Buffer) {
    chainID = new BN(node.ChainID, 10)
  } else if (typeof node.ChainID === 'bigint') {
    chainID = new BN(node.ChainID.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.ChainID needs to be of type BN')
  }

  return chainID
}

function prepareLegacyTx (node: any): Transaction {
  const gasPrice = prepareGasPrice(node)
  const baseTx = prepareBaseFields(node, 0)

  return {
    TxType: baseTx.TxType,
    AccountNonce: baseTx.AccountNonce,
    GasPrice: gasPrice,
    GasLimit: baseTx.GasLimit,
    Recipient: baseTx.Recipient,
    Amount: baseTx.Amount,
    Data: baseTx.Data,
    V: baseTx.V,
    R: baseTx.R,
    S: baseTx.S
  }
}

function prepareAccessListTx (node: any): Transaction {
  const gasPrice = prepareGasPrice(node)
  const chainID = prepareChainID(node)
  const baseTx = prepareBaseFields(node, 1)
  validateAccessList(node)

  return {
    TxType: baseTx.TxType,
    ChainID: chainID,
    AccountNonce: baseTx.AccountNonce,
    GasPrice: gasPrice,
    GasLimit: baseTx.GasLimit,
    Recipient: baseTx.Recipient,
    Amount: baseTx.Amount,
    Data: baseTx.Data,
    AccessList: node.AccessList,
    V: baseTx.V,
    R: baseTx.R,
    S: baseTx.S
  }
}

function prepareFeeMarketTx (node: any): Transaction {
  let gasTipCap: BN
  let gasFeeCap: BN

  const chainID = prepareChainID(node)
  const baseTx = prepareBaseFields(node, 2)
  validateAccessList(node)

  if (node.GasTipCap == null) {
    throw new TypeError('Invalid eth-tx form; node.GasTipCap is null/undefined')
  } else if (typeof node.GasTipCap === 'string' || typeof node.GasTipCap === 'number' || node.GasTipCap instanceof Uint8Array ||
    node.GasTipCap instanceof Buffer) {
    gasTipCap = new BN(node.GasTipCap, 10)
  } else if (typeof node.GasTipCap === 'bigint') {
    gasTipCap = new BN(node.GasTipCap.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasTipCap needs to be of type BN')
  }

  if (node.GasFeeCap == null) {
    throw new TypeError('Invalid eth-tx form; node.GasFeeCap is null/undefined')
  } else if (typeof node.GasFeeCap === 'string' || typeof node.GasFeeCap === 'number' || node.GasFeeCap instanceof Uint8Array ||
    node.GasFeeCap instanceof Buffer) {
    gasFeeCap = new BN(node.GasFeeCap, 10)
  } else if (typeof node.GasFeeCap === 'bigint') {
    gasFeeCap = new BN(node.GasFeeCap.toString(), 10)
  } else {
    throw new TypeError('Invalid eth-tx form; node.GasFeeCap needs to be of type BN')
  }

  return {
    TxType: baseTx.TxType,
    ChainID: chainID,
    AccountNonce: baseTx.AccountNonce,
    GasTipCap: gasTipCap,
    GasFeeCap: gasFeeCap,
    GasLimit: baseTx.GasLimit,
    Recipient: baseTx.Recipient,
    Amount: baseTx.Amount,
    Data: baseTx.Data,
    AccessList: node.AccessList,
    V: baseTx.V,
    R: baseTx.R,
    S: baseTx.S
  }
}

export function prepare (node: any): Transaction {
  if (typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx form')
  }

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
}

function validateBaseTx (node: Transaction) {
  if (node.AccountNonce == null) {
    throw new TypeError('Invalid eth-tx form; node.AccountNonce is null/undefined')
  } else if (!(node.AccountNonce instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.AccountNonce needs to be of type BN')
  }

  if (node.GasLimit == null) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit is null/undefined')
  } else if (!(node.GasLimit instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.GasLimit needs to be of type BN')
  }

  if (node.Recipient === null) {
    throw new TypeError('Invalid eth-tx form; node.Recipient is null')
  } else if (!(node.Recipient instanceof Address) && typeof node.Recipient !== 'undefined') {
    throw new TypeError('Invalid eth-tx form; node.Recipient needs to be of type Address or undefined')
  }

  if (node.Amount == null) {
    throw new TypeError('Invalid eth-tx form; node.Amount is null/undefined')
  } else if (!(node.Amount instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.Amount needs to be of type BN')
  }

  if (node.Data == null) {
    throw new TypeError('Invalid eth-tx form; node.Data is null/undefined')
  } else if (!(node.Data instanceof Buffer)) {
    throw new TypeError('Invalid eth-tx form; node.Data needs to be of type Buffer')
  }

  if (node.V == null) {
    throw new TypeError('Invalid eth-tx form; node.V is null/undefined')
  } else if (!(node.V instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.V needs to be of type BN')
  }

  if (node.R == null) {
    throw new TypeError('Invalid eth-tx form; node.R is null/undefined')
  } else if (!(node.R instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.R needs to be of type BN')
  }

  if (node.S == null) {
    throw new TypeError('Invalid eth-tx form; node.S is null/undefined')
  } else if (!(node.S instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.S needs to be of type BN')
  }
}

function validateGasPrice (node: Transaction) {
  if (node.GasPrice == null) {
    throw new TypeError('Invalid eth-tx form; node.GasPrice is null/undefined')
  } else if (!(node.GasPrice instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.GasPrice needs to be of type BN')
  }
}

function validateChainID (node: Transaction) {
  if (node.ChainID == null) {
    throw new TypeError('Invalid eth-tx form; node.ChainID is null/undefined')
  } else if (!(node.ChainID instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.ChainID needs to be of type BN')
  }
}

function validateAccessList (node: Transaction) {
  if (node.AccessList === null) {
    throw new TypeError('Invalid eth-tx form; node.AccessList is null')
  } else if (node.AccessList instanceof Array) {
    for (const accessListElement of node.AccessList) {
      if (accessListElement instanceof Array) {
        if (accessListElement.length !== 2) {
          throw new TypeError('Invalid eth-tx form; node.AccessList members needs to be Arrays of length 2')
        }
        accessListElement.forEach((accessListElementElement, i) => {
          if (i === 0) {
            if (!(accessListElementElement instanceof Buffer)) {
              throw new TypeError('Invalid eth-tx form; node.AccessList member first element needs to be a Buffer')
            }
          }
          if (i === 1) {
            if (accessListElementElement instanceof Array) {
              for (const accessListElementElementElement of accessListElementElement) {
                if (!(accessListElementElementElement instanceof Buffer)) {
                  throw new TypeError('Invalid eth-tx form; node.AccessList member second element needs to be an Array of Buffers')
                }
              }
            } else {
              throw new TypeError('Invalid eth-tx form; node.AccessList member second element needs to be an Array of Buffers')
            }
          }
        })
      } else {
        throw new TypeError('Invalid eth-tx form; node.AccessList members needs to be Arrays')
      }
    }
  } else if (node.AccessList !== undefined) {
    throw new TypeError('Invalid eth-tx form; node.AccessList needs to be an Array or undefined')
  }
}

function validateLegacyTx (node: Transaction) {
  validateBaseTx(node)
  validateGasPrice(node)
}

function validateAccessListTx (node: Transaction) {
  validateBaseTx(node)
  validateGasPrice(node)
  validateChainID(node)
  validateAccessList(node)
}
function validateFeeMarketTx (node: Transaction) {
  validateBaseTx(node)
  validateChainID(node)
  validateAccessList(node)

  if (node.GasTipCap == null) {
    throw new TypeError('Invalid eth-tx form; node.GasTipCap is null/undefined')
  } else if (!(node.GasTipCap instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.GasTipCap needs to be of type BN')
  }

  if (node.GasFeeCap == null) {
    throw new TypeError('Invalid eth-tx form; node.GasFeeCap is null/undefined')
  } else if (!(node.GasFeeCap instanceof BN)) {
    throw new TypeError('Invalid eth-tx form; node.GasFeeCap needs to be of type BN')
  }
}

export function validate (node: Transaction) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid eth-tx form')
  }

  if (!hasOnlyProperties(node, txNodeProperties)) {
    throw new TypeError('Invalid eth-tx form (extraneous properties)')
  }

  let txType: number

  if (node.TxType == null) {
    throw new TypeError('Invalid eth-tx form; node.TxType is null/undefined')
  } else if (typeof node.TxType !== 'number') {
    throw new TypeError('Invalid eth-tx form; node.TxType needs to be of type number')
  } else {
    txType = node.TxType
  }

  switch (txType) {
    case 0:
      return validateLegacyTx(node)
    case 1:
      return validateAccessListTx(node)
    case 2:
      return validateFeeMarketTx(node)
    default:
      throw Error(`unrecognized TxType: ${txType}`)
  }
}
