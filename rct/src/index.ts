import { TransactionReceipt } from 'web3-core'
import { Transaction } from '../../tx/src/interface'
import {
  AccessListEIP2930Transaction,
  AccessListEIP2930TxData, FeeMarketEIP1559Transaction, FeeMarketEIP1559TxData,
  Transaction as LegacyTransaction, TransactionFactory,
  TxData
} from '@ethereumjs/tx'

export const name = 'eth-tx-receipt'
export const code = 0x95

export function encode (node: Transaction): ByteView<Transaction> {
  if (node.TxType === 0) {
    const legacyTx: TxData = {
      nonce: node.AccountNonce.toString(),
      gasLimit: node.GasLimit.toString(),
      value: node.Amount.toString(),
      data: node.Data,
      v: node.V.toString(),
      r: node.R.toString(),
      s: node.S.toString(),
      type: node.TxType
    }
    if (typeof node.GasPrice !== 'undefined') {
      Object.defineProperty(legacyTx, 'gasPrice', {
        value: node.GasPrice.toString()
      })
    }
    if (typeof node.Recipient !== 'undefined') {
      Object.defineProperty(legacyTx, 'to', {
        value: Buffer.from(node.Recipient)
      })
    }
    return LegacyTransaction.fromTxData(legacyTx).serialize()
  } else if (node.TxType === 1) {
    const accessListTx: AccessListEIP2930TxData = {
      nonce: node.AccountNonce.toString(),
      gasLimit: node.GasLimit.toString(),
      value: node.Amount.toString(),
      data: node.Data,
      v: node.V.toString(),
      r: node.R.toString(),
      s: node.S.toString(),
      type: node.TxType,
      accessList: node.AccessList
    }
    if (typeof node.Recipient !== 'undefined') {
      Object.defineProperty(accessListTx, 'to', {
        value: Buffer.from(node.Recipient)
      })
    }
    if (typeof node.GasPrice !== 'undefined') {
      Object.defineProperty(accessListTx, 'gasPrice', {
        value: node.GasPrice.toString()
      })
    }
    if (typeof node.ChainID !== 'undefined') {
      Object.defineProperty(accessListTx, 'chainId', {
        value: node.ChainID.toString()
      })
    }
    return AccessListEIP2930Transaction.fromTxData(accessListTx).serialize()
  } else if (node.TxType === 2) {
    const dynamicFeeTx: FeeMarketEIP1559TxData = {
      nonce: node.AccountNonce.toString(),
      gasLimit: node.GasLimit.toString(),
      value: node.Amount.toString(),
      data: node.Data,
      v: node.V.toString(),
      r: node.R.toString(),
      s: node.S.toString(),
      type: node.TxType,
      accessList: node.AccessList
    }
    if (typeof node.Recipient !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'to', {
        value: Buffer.from(node.Recipient)
      })
    }
    if (typeof node.ChainID !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'chainId', {
        value: node.ChainID.toString()
      })
    }
    if (typeof node.GasTipCap !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'maxPriorityFeePerGas', {
        value: node.GasTipCap.toString()
      })
    }
    if (typeof node.GasFeeCap !== 'undefined') {
      Object.defineProperty(dynamicFeeTx, 'maxFeePerGas', {
        value: node.GasFeeCap.toString()
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
    AccountNonce: BigInt(legacyTx.nonce.toString()),
    GasPrice: BigInt(legacyTx.gasPrice.toString()),
    GasLimit: BigInt(legacyTx.gasLimit.toString()),
    Amount: BigInt(legacyTx.value.toString()),
    Data: legacyTx.data,
    V: BigInt(0),
    R: BigInt(0),
    S: BigInt(0)
  }
  if (typeof legacyTx.to !== 'undefined') {
    Object.defineProperty(tx, 'Recipient', {
      value: Uint8Array.from(legacyTx.to.toBuffer())
    })
  }
  if (typeof legacyTx.v !== 'undefined') {
    Object.defineProperty(tx, 'V', {
      value: BigInt(legacyTx.v.toString())
    })
  } else {
    throw Error('transaction IPLD must have V')
  }
  if (typeof legacyTx.r !== 'undefined') {
    Object.defineProperty(tx, 'R', {
      value: BigInt(legacyTx.r.toString())
    })
  } else {
    throw Error('transaction IPLD must have R')
  }
  if (typeof legacyTx.s !== 'undefined') {
    Object.defineProperty(tx, 'S', {
      value: BigInt(legacyTx.s.toString())
    })
  } else {
    throw Error('transaction IPLD must have S')
  }
  return tx
}

function unpackAccessListTx (alTx: AccessListEIP2930Transaction): Transaction {
  const tx: Transaction = {
    TxType: 0,
    AccountNonce: BigInt(alTx.nonce.toString()),
    GasPrice: BigInt(alTx.gasPrice.toString()),
    GasLimit: BigInt(alTx.gasLimit.toString()),
    Amount: BigInt(alTx.value.toString()),
    Data: alTx.data,
    V: BigInt(0),
    R: BigInt(0),
    S: BigInt(0),
    ChainID: BigInt(alTx.chainId.toString()),
    AccessList: alTx.accessList
  }
  if (typeof alTx.to !== 'undefined') {
    Object.defineProperty(tx, 'Recipient', {
      value: Uint8Array.from(alTx.to.toBuffer())
    })
  }
  if (typeof alTx.v !== 'undefined') {
    Object.defineProperty(tx, 'V', {
      value: BigInt(alTx.v.toString())
    })
  } else {
    throw Error('transaction IPLD must have V')
  }
  if (typeof alTx.r !== 'undefined') {
    Object.defineProperty(tx, 'R', {
      value: BigInt(alTx.r.toString())
    })
  } else {
    throw Error('transaction IPLD must have R')
  }
  if (typeof alTx.s !== 'undefined') {
    Object.defineProperty(tx, 'S', {
      value: BigInt(alTx.s.toString())
    })
  } else {
    throw Error('transaction IPLD must have S')
  }
  return tx
}

function unpackFeeMarketTx (fmTx: FeeMarketEIP1559Transaction): Transaction {
  const tx: Transaction = {
    TxType: 0,
    AccountNonce: BigInt(fmTx.nonce.toString()),
    GasLimit: BigInt(fmTx.gasLimit.toString()),
    Amount: BigInt(fmTx.value.toString()),
    Data: fmTx.data,
    V: BigInt(0),
    R: BigInt(0),
    S: BigInt(0),
    ChainID: BigInt(fmTx.chainId.toString()),
    AccessList: fmTx.accessList,
    GasTipCap: BigInt(fmTx.maxPriorityFeePerGas.toString()),
    GasFeeCap: BigInt(fmTx.maxFeePerGas.toString())
  }
  if (typeof fmTx.to !== 'undefined') {
    Object.defineProperty(tx, 'Recipient', {
      value: Uint8Array.from(fmTx.to.toBuffer())
    })
  }
  if (typeof fmTx.v !== 'undefined') {
    Object.defineProperty(tx, 'V', {
      value: BigInt(fmTx.v.toString())
    })
  } else {
    throw Error('transaction IPLD must have V')
  }
  if (typeof fmTx.r !== 'undefined') {
    Object.defineProperty(tx, 'R', {
      value: BigInt(fmTx.r.toString())
    })
  } else {
    throw Error('transaction IPLD must have R')
  }
  if (typeof fmTx.s !== 'undefined') {
    Object.defineProperty(tx, 'S', {
      value: BigInt(fmTx.s.toString())
    })
  } else {
    throw Error('transaction IPLD must have S')
  }
  return tx
}
