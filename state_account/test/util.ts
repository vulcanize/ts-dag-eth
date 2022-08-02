import chai from 'chai'
import { Account } from '../src/interface'
import { CID } from 'multiformats/cid'
import BN from 'bn.js'

const { assert } = chai

export function checkEquality (expected: Account, got: Account) {
  for (const [k, v] of Object.entries(expected)) {
    if (Object.prototype.hasOwnProperty.call(got, k)) {
      const actualVal = got[k as keyof Account]
      if (v instanceof CID) {
        if (actualVal instanceof CID) {
          assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type CID`)
        }
      } else if (v instanceof BN) {
        if (actualVal instanceof BN) {
          assert.equal(v.toString(), actualVal.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
        } else {
          throw new TypeError(`key ${k} expected to be of type BN`)
        }
      } else {
        assert.equal(got[k as keyof Account], v, `actual ${k}: ${got[k as keyof Account]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedAccount is not found in the preparedAccount`)
    }
  }
}
