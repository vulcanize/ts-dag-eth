import { ByteView } from 'multiformats/codecs/interface'
import { Transaction } from '../src/interface'
import {
  TxData,
  Transaction as LegacyTransaction,
  AccessListEIP2930TxData,
  AccessListEIP2930Transaction,
  FeeMarketEIP1559TxData,
  FeeMarketEIP1559Transaction,
  TransactionFactory
} from '@ethereumjs/tx'
const BN = require('bn.js')

export const name = 'eth-tx'
export const code = 0x93

export function encode (node: Transaction): ByteView<Transaction> {
  if (node.TxType === 0) {
    const legacyTx: TxData = {
      nonce: node.AccountNonce,
      gasLimit: node.GasLimit,
      value: node.Amount,
      data: node.Data,
      v: node.V,
      r: node.R,
      s: node.S,
      type: node.TxType
    }
    if (typeof node.GasPrice !== 'undefined') {
      Object.defineProperty(legacyTx, 'gasPrice', {
        value: node.GasPrice
      })
    }
    if (typeof node.Recipient !== 'undefined') {
      Object.defineProperty(legacyTx, 'to', {
        value: node.Recipient
      })
    }
    return LegacyTransaction.fromTxData(legacyTx).serialize()
  } else if (node.TxType === 1) {
    const accessListTx: AccessListEIP2930TxData = {
      nonce: node.AccountNonce,
      gasLimit: node.GasLimit,
      value: node.Amount,
      data: node.Data,
      v: node.V,
      r: node.R,
      s: node.S,
      type: node.TxType,
      accessList: node.AccessList
    }
    if (typeof node.Recipient !== 'undefined') {
      Object.defineProperty(accessListTx, 'to', {
        value: node.Recipient
      })
    }
    if (typeof node.GasPrice !== 'undefined') {
      Object.defineProperty(accessListTx, 'gasPrice', {
        value: node.GasPrice
      })
    }
    if (typeof node.ChainID !== 'undefined') {
      Object.defineProperty(accessListTx, 'chainId', {
        value: node.ChainID
      })
    }
    return AccessListEIP2930Transaction.fromTxData(accessListTx).serialize()
  } else if (node.TxType === 2) {
    const dynamicFeeTx: FeeMarketEIP1559TxData = {
      nonce: node.AccountNonce,
      gasLimit: node.GasLimit,
      value: node.Amount,
      data: node.Data,
      v: node.V,
      r: node.R,
      s: node.S,
      type: node.TxType,
      accessList: node.AccessList
    }
    if (typeof node.Recipient !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'to', {
        value: node.Recipient
      })
    }
    if (typeof node.ChainID !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'chainId', {
        value: node.ChainID
      })
    }
    if (typeof node.GasTipCap !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'maxPriorityFeePerGas', {
        value: node.GasTipCap
      })
    }
    if (typeof node.GasFeeCap !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'maxFeePerGas', {
        value: node.GasFeeCap
      })
    }
    return FeeMarketEIP1559Transaction.fromTxData(dynamicFeeTx).serialize()
  } else {
    throw new Error(`unrecognized TxType: ${node.TxType}`)
  }
}

export function decode (bytes: ByteView<Transaction>): Transaction {
  const bytesBuffer = Buffer.from(bytes.valueOf())
  const typedTx = TransactionFactory.fromSerializedData(bytesBuffer)
  let tx: Transaction
  if (!('type' in typedTx) || typedTx.type === undefined) {
    // Assume legacy transaction
    const legacyTx = <LegacyTransaction>typedTx
    tx = unpackLegacyTx(legacyTx)
  } else {
    const txType = typedTx.type
    if (txType === 0) {
      const legacyTx = <LegacyTransaction>typedTx
      tx = unpackLegacyTx(legacyTx)
    } else if (txType === 1) {
      const alTx = <AccessListEIP2930Transaction>typedTx
      tx = unpackAccessListTx(alTx)
    } else if (txType === 2) {
      const fmTx = <FeeMarketEIP1559Transaction>typedTx
      tx = unpackFeeMarketTx(fmTx)
    } else {
      throw new Error(`unrecognized TxType: ${txType}`)
    }
  }
  return tx
}

function unpackLegacyTx (legacyTx: LegacyTransaction): Transaction {
  const tx: Transaction = {
    TxType: 0,
    AccountNonce: legacyTx.nonce,
    GasPrice: legacyTx.gasPrice,
    GasLimit: legacyTx.gasLimit,
    Amount: legacyTx.value,
    Data: legacyTx.data,
    Recipient: legacyTx.to,
    V: new BN('0', 10),
    R: new BN('0', 10),
    S: new BN('0', 10)
  }
  checkSig(legacyTx)
  return tx
}

function unpackAccessListTx (alTx: AccessListEIP2930Transaction): Transaction {
  const tx: Transaction = {
    TxType: 0,
    AccountNonce: alTx.nonce,
    GasPrice: alTx.gasPrice,
    GasLimit: alTx.gasLimit,
    Amount: alTx.value,
    Data: alTx.data,
    Recipient: alTx.to,
    V: new BN('0', 10),
    R: new BN('0', 10),
    S: new BN('0', 10),
    ChainID: alTx.chainId,
    AccessList: alTx.accessList
  }
  checkSig(alTx)
  return tx
}

function unpackFeeMarketTx (fmTx: FeeMarketEIP1559Transaction): Transaction {
  const tx: Transaction = {
    TxType: 0,
    AccountNonce: fmTx.nonce,
    GasLimit: fmTx.gasLimit,
    Amount: fmTx.value,
    Data: fmTx.data,
    Recipient: fmTx.to,
    V: new BN('0', 10),
    R: new BN('0', 10),
    S: new BN('0', 10),
    ChainID: fmTx.chainId,
    AccessList: fmTx.accessList,
    GasTipCap: fmTx.maxPriorityFeePerGas,
    GasFeeCap: fmTx.maxFeePerGas
  }
  checkSig(fmTx)
  return tx
}

function checkSig (tx: LegacyTransaction | FeeMarketEIP1559Transaction | AccessListEIP2930Transaction) {
  if (typeof tx.v !== 'undefined') {
    Object.defineProperty(tx, 'V', {
      value: tx.v
    })
  } else {
    throw Error('transaction IPLD must have V')
  }
  if (typeof tx.r !== 'undefined') {
    Object.defineProperty(tx, 'R', {
      value: tx.r
    })
  } else {
    throw Error('transaction IPLD must have R')
  }
  if (typeof tx.s !== 'undefined') {
    Object.defineProperty(tx, 'S', {
      value: tx.s
    })
  } else {
    throw Error('transaction IPLD must have S')
  }
}
