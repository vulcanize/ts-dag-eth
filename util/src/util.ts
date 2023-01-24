import { CID } from 'multiformats/cid'
import { create } from 'multiformats/hashes/digest'
import { CodecCode } from 'multicodec'
import { keccak256, randomHex } from 'web3-utils'
import { Nibbles } from 'merkle-patricia-tree/dist/trieNode'
import { isTerminator, removeHexPrefix } from 'merkle-patricia-tree/dist/util/hex'
const toBuffer = require('typedarray-to-buffer')

const version = 1
const keccakMultihashCode = 0x1b

export function cidFromHash (codec: CodecCode, rawhash: Buffer): CID {
  const multihash = create(keccakMultihashCode, rawhash)
  return CID.create(version, codec, multihash)
}

export function hashFromCID (cid: CID): Buffer {
  return toBuffer(cid.multihash.digest)
}

export function randomHash (): Buffer {
  const rnHex = randomHex(32)
  const randomHash = keccak256(rnHex)
  return Buffer.from(randomHash, 'hex')
}

export function bufferToBigInt (buf: Buffer): bigint {
  const hex: string[] = []
  const u8 = Uint8Array.from(buf)

  u8.forEach(function (i) {
    let h = i.toString(16)
    if (h.length % 2) { h = '0' + h }
    hex.push(h)
  })

  return BigInt('0x' + hex.join(''))
}

export function arrayToBigInt (u8: Uint8Array): bigint {
  const hex: string[] = []

  u8.forEach(function (i) {
    let h = i.toString(16)
    if (h.length % 2) { h = '0' + h }
    hex.push(h)
  })

  return BigInt('0x' + hex.join(''))
}

export function bufferToNumber (buf: Buffer): number {
  const hex: string[] = []
  const u8 = Uint8Array.from(buf)

  u8.forEach(function (i) {
    let h = i.toString(16)
    if (h.length % 2) { h = '0' + h }
    hex.push(h)
  })

  return Number('0x' + hex.join(''))
}

export function arrayToNumber (u8: Uint8Array): number {
  const hex: string[] = []

  u8.forEach(function (i) {
    let h = i.toString(16)
    if (h.length % 2) { h = '0' + h }
    hex.push(h)
  })

  return Number('0x' + hex.join(''))
}

export function hasOnlyProperties (node: any, properties: string[]): boolean {
  return !Object.keys(node).some((p) => !properties.includes(p))
}

export function compactToHex (compact: Buffer): number[] {
  const nibbles = bufferToNibbles(compact)
  if (isTerminator(nibbles)) {
    nibbles.push(16)
  }
  return removeHexPrefix(nibbles)
}

export function compactStrToNibbles (key: string): Nibbles {
  return bufferToNibbles(Buffer.from(key))
}

export function nibblesStrToNibbles (str: string): Nibbles {
  const bkey = Buffer.from(str)
  const nibbles = [] as number[]

  for (let i = 0; i < bkey.length; i++) {
    nibbles[i] = bkey[i]
  }

  return nibbles
}

export function stringListToNibbles (str: string): Nibbles {
  return str.split(',').map(Number)
}

export function bufferToNibbles (key: Buffer): Nibbles {
  const bkey = Buffer.from(key)
  const nibbles = [] as any

  for (let i = 0; i < bkey.length; i++) {
    let q = i * 2
    nibbles[q] = bkey[i] >> 4
    ++q
    nibbles[q] = bkey[i] % 16
  }

  return nibbles
}

export function nibblesToBuffer (arr: Nibbles): Buffer {
  const buf = Buffer.alloc(arr.length / 2)
  for (let i = 0; i < buf.length; i++) {
    let q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}
