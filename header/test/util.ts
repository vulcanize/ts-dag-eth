import { Header } from '../src/interface'
import { Address } from 'ethereumjs-util'
import { CID } from 'multiformats/cid'
import { assert } from 'chai'
import BN from 'bn.js'

export function checkEquality (expected: Header, got: Header) {
  for (const [k, v] of Object.entries(expected)) {
    if (Object.prototype.hasOwnProperty.call(got, k)) {
      const actualVal = got[k as keyof Header]
      if (v instanceof CID) {
        if (actualVal instanceof CID) {
          assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type CID`)
        }
      } else if (v instanceof Address) {
        if (actualVal instanceof Address) {
          assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type Address`)
        }
      } else if (v instanceof Buffer) {
        if (actualVal instanceof Buffer) {
          assert(v.equals(actualVal), `actual ${k}: ${actualVal} does not equal expected: ${v}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type Buffer`)
        }
      } else if (v instanceof BN) {
        if (actualVal instanceof BN) {
          assert.equal(v.toString(), actualVal.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type BN`)
        }
      } else {
        assert.equal(got[k as keyof Header], v, `actual ${k}: ${got[k as keyof Header]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedHeaderNode is not found in the preparedHeader`)
    }
  }
}
