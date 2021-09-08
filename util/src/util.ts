import { CID } from 'multiformats/cid'
import { create } from 'multiformats/hashes/digest'
import { CodecCode } from 'multicodec'

const version = 1
const keccakMultihashCode = 0x1b

export function cidFromHash (codec: CodecCode, rawhash: Uint8Array): CID {
  const multihash = create(keccakMultihashCode, rawhash)
  return CID.create(version, codec, multihash)
}

export function hashFromCID (cid: CID): Uint8Array {
  return cid.multihash.digest
}