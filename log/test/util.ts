import { Log } from '../src/interface'
import { Address } from 'ethereumjs-util'
import { assert } from 'chai'

export function checkEquality (expected: Log, got: Log) {
  for (const [k, v] of Object.entries(expected)) {
    if (Object.prototype.hasOwnProperty.call(got, k)) {
      const actualVal = got[k as keyof Log]
      if (Array.isArray(v)) {
        if (Array.isArray(actualVal)) {
          assert.equal(v.length, actualVal.length, `actual ${k} length: ${actualVal.length} does not equal expected: ${v.length}`)
          for (const [i, topic] of v.entries()) {
            assert(topic.equals(actualVal[i]), `actual Topic: ${actualVal[i]} does not equal expected: ${topic}`)
          }
        } else {
          throw new TypeError(`key ${k} expected to be of type Buffer[]`)
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
      } else {
        assert.equal(got[k as keyof Log], v, `actual ${k}: ${got[k as keyof Log]} does not equal expected: ${v}`)
      }
    } else {
      throw new Error(`key ${k} found in expectedLogNode is not found in the preparedLog`)
    }
  }
}
