import BN from 'bn.js'
import { LogsBuffer } from '../../log/src/interface'
import {
  MAX_INTEGER,
  TWO_POW256,
  rlp, bnToUnpaddedBuffer
} from 'ethereumjs-util'
import { resolvePostStateOrStatus } from './helpers'

const EIP2930_TRANSACTION_TYPE = 1
const EIP2930_TRANSACTION_TYPE_BUFFER = Buffer.from(EIP2930_TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex')
const EIP1559_TRANSACTION_TYPE = 2
const EIP1559_TRANSACTION_TYPE_BUFFER = Buffer.from(EIP1559_TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex')
export const RECEIPT_STATUS_FAILED_RLP = rlp.encode('')
export const RECEIPT_STATUS_SUCCESS_RLP = rlp.encode('0x01')

export interface ReceiptData {
  TxType?: number,
  PostState?: Buffer,
  Status?: number,
  CumulativeGasUsed: BN,
  Bloom: Buffer,
  Logs: LogsBuffer,
}

export type ReceiptValuesArray = [
  Buffer,
  Buffer,
  Buffer,
  LogsBuffer,
]

export abstract class BaseReceipt {
  private readonly _type: number

  public readonly postState?: Buffer
  public readonly status?: number
  public readonly bloom: Buffer
  public readonly cumulativeGasUsed: BN
  public readonly logs: LogsBuffer

  constructor (rctData: ReceiptData) {
    this._type = rctData.TxType == null ? 0 : rctData.TxType
    this.postState = rctData.PostState
    this.status = rctData.Status
    this.bloom = rctData.Bloom
    this.cumulativeGasUsed = rctData.CumulativeGasUsed
    this.logs = rctData.Logs

    this._validateCannotExceedMaxInteger({
      cumulativeGasUsed: this.cumulativeGasUsed
    })
  }

  /**
   * Returns a Buffer Array of the raw Buffers of this receipt, in order.
   */
  raw (): ReceiptValuesArray {
    let postStateOrStatus: Buffer
    if (this.postState != null) {
      postStateOrStatus = this.postState
    } else if (this.status === 0) {
      postStateOrStatus = RECEIPT_STATUS_FAILED_RLP
    } else if (this.status === 1) {
      postStateOrStatus = RECEIPT_STATUS_SUCCESS_RLP
    } else {
      throw new TypeError('Invalid Receipt form; either postState or status needs to be defined')
    }
    return [
      postStateOrStatus,
      bnToUnpaddedBuffer(this.cumulativeGasUsed),
      this.bloom,
      this.logs
    ]
  }

  /**
   * Returns the consensus encoding of the receipt.
   */
  abstract serialize(): Buffer

  /**
   * Returns the transaction type.
   *
   * Note: legacy tx rcts will return tx type `0`.
   */
  get type () {
    return this._type
  }

  protected _validateCannotExceedMaxInteger (values: { [key: string]: BN | undefined }, bits = 53) {
    for (const [key, value] of Object.entries(values)) {
      if (bits === 53) {
        if (value?.gt(MAX_INTEGER)) {
          throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
        }
      } else if (bits === 256) {
        if (value?.gte(TWO_POW256)) {
          throw new Error(`${key} must be less than 2^256, given ${value}`)
        }
      } else {
        throw new Error('unimplemented bits value')
      }
    }
  }
}

export class LegacyReceipt extends BaseReceipt {
  serialize (): Buffer {
    return rlp.encode(this.raw())
  }

  public static fromSerializedRct (serialized: Buffer): LegacyReceipt {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new TypeError('Invalid serialized rct input. Must be array')
    }

    return LegacyReceipt.fromValuesArray(values as any)
  }

  public static fromValuesArray (values: ReceiptValuesArray): LegacyReceipt {
    if (values.length !== 4) {
      throw new Error(
        'Invalid receipt. Only expecting 4 values.'
      )
    }

    const [
      postStateOrStatus,
      cumulativeGasUsed,
      bloom,
      logs
    ] = values

    const [postState, status] = resolvePostStateOrStatus(postStateOrStatus)

    return new LegacyReceipt(
      {
        TxType: 0,
        PostState: postState,
        Status: status,
        Bloom: bloom,
        CumulativeGasUsed: new BN(cumulativeGasUsed),
        Logs: logs
      }
    )
  }
}

export class AccessListReceipt extends BaseReceipt {
  serialize (): Buffer {
    const base = this.raw()
    return Buffer.concat([EIP2930_TRANSACTION_TYPE_BUFFER, rlp.encode(base)])
  }

  public static fromSerializedRct (serialized: Buffer): AccessListReceipt {
    if (!serialized.slice(0, 1).equals(EIP2930_TRANSACTION_TYPE_BUFFER)) {
      throw new TypeError(
        `Invalid serialized tx input: not an EIP-2930 transaction receipt (wrong tx type, expected: ${EIP2930_TRANSACTION_TYPE_BUFFER}, received: ${serialized
          .slice(0, 1)
          .toString('hex')}`
      )
    }
    const values = rlp.decode(serialized.slice(1))

    if (!Array.isArray(values)) {
      throw new TypeError('Invalid serialized rct input: must be array')
    }

    return AccessListReceipt.fromValuesArray(values as any)
  }

  /**
   * Create a AccessListReceipt from a values array.
   */
  public static fromValuesArray (values: ReceiptValuesArray): AccessListReceipt {
    if (values.length !== 4) {
      throw new Error(
        'Invalid receipt. Only expecting 4 values.'
      )
    }

    const [
      postStateOrStatus,
      cumulativeGasUsed,
      bloom,
      logs
    ] = values

    const [postState, status] = resolvePostStateOrStatus(postStateOrStatus)

    return new AccessListReceipt(
      {
        TxType: 1,
        PostState: postState,
        Status: status,
        Bloom: bloom,
        CumulativeGasUsed: new BN(cumulativeGasUsed),
        Logs: logs
      }
    )
  }
}

export class FeeMarketReceipt extends BaseReceipt {
  serialize (): Buffer {
    const base = this.raw()
    return Buffer.concat([EIP1559_TRANSACTION_TYPE_BUFFER, rlp.encode(base)])
  }

  public static fromSerializedRct (serialized: Buffer): FeeMarketReceipt {
    if (!serialized.slice(0, 1).equals(EIP1559_TRANSACTION_TYPE_BUFFER)) {
      throw new TypeError(
        `Invalid serialized tx input: not an EIP-1559 transaction receipt (wrong tx type, expected: ${EIP1559_TRANSACTION_TYPE_BUFFER}, received: ${serialized
          .slice(0, 1)
          .toString('hex')}`
      )
    }
    const values = rlp.decode(serialized.slice(1))

    if (!Array.isArray(values)) {
      throw new TypeError('Invalid serialized rct input: must be array')
    }

    return FeeMarketReceipt.fromValuesArray(values as any)
  }

  /**
   * Create a FeeMarketReceipt from a values array.
   */
  public static fromValuesArray (values: ReceiptValuesArray): FeeMarketReceipt {
    if (values.length !== 4) {
      throw new Error(
        'Invalid receipt. Only expecting 4 values.'
      )
    }

    const [
      postStateOrStatus,
      cumulativeGasUsed,
      bloom,
      logs
    ] = values

    const [postState, status] = resolvePostStateOrStatus(postStateOrStatus)

    return new FeeMarketReceipt(
      {
        TxType: 2,
        PostState: postState,
        Status: status,
        Bloom: bloom,
        CumulativeGasUsed: new BN(cumulativeGasUsed),
        Logs: logs
      }
    )
  }
}

export class ReceiptFactory {
  /**
   * Decodes consensus encoding into the appropriate class
   */
  public static fromSerializedRct (serialized: Buffer): LegacyReceipt | AccessListReceipt | FeeMarketReceipt {
    if (serialized[0] <= 0x7f) {
      switch (serialized[0]) {
        case 1:
          return AccessListReceipt.fromSerializedRct(serialized)
        case 2:
          return FeeMarketReceipt.fromSerializedRct(serialized)
        default:
          throw new TypeError(`Unrecognized receipt tx type ${serialized[0]}`)
      }
    } else {
      return LegacyReceipt.fromSerializedRct(serialized)
    }
  }

  /**
   * Unpacks ReceiptData into the appropriate class
   */
  public static fromReceiptData (rctData: ReceiptData): LegacyReceipt | AccessListReceipt | FeeMarketReceipt {
    switch (rctData.TxType) {
      case 0 || undefined:
        return new LegacyReceipt(rctData)
      case 1:
        return new AccessListReceipt(rctData)
      case 2:
        return new FeeMarketReceipt(rctData)
      default:
        throw new TypeError(`Unrecognized receipt tx type ${rctData.TxType}`)
    }
  }
}

export type TypedReceipt =
  LegacyReceipt |
  AccessListReceipt |
  FeeMarketReceipt
