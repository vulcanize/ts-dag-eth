import { Account as EthAccount } from 'ethereumjs-util'
import chai from 'chai'
import * as dagStateAccount from '../src'
import { bytes } from 'multiformats'
import { cidFromHash } from '../../util/src/util'
import { code as storageTrieCode } from '../../storage_trie/src/index.js'
import BN from 'bn.js'

const { encode, decode, rawCode } = dagStateAccount
const { assert } = chai
const test = it
const same = assert.deepStrictEqual

describe('dag-state-account', () => {
  const ethAccount = EthAccount.fromAccountData({
    nonce: '1337',
    balance: '13337',
    stateRoot: '0xe8ca03102d5d8be0f2024797897194e3c607711e5b32fa5840a341207035331d',
    codeHash: '0xe9df4f58442f3c5b69ab733c0441d13c609429806ca41e3814caa66a314b9612'
  })
  const expectedSerialization = ethAccount.serialize()
  const dagEthAccount = decode(expectedSerialization)
  const roundTripSerialization = encode(dagEthAccount)
  const srUint8Array = Buffer.from('0xe8ca03102d5d8be0f2024797897194e3c607711e5b32fa5840a341207035331d', 'hex')
  const chUint8Array = Buffer.from('0xe9df4f58442f3c5b69ab733c0441d13c609429806ca41e3814caa66a314b9612', 'hex')
  const expectedDagEthAccount = {
    Nonce: new BN(1337),
    Balance: new BN(13337),
    StorageRootCID: cidFromHash(storageTrieCode, srUint8Array),
    CodeCID: cidFromHash(rawCode, chUint8Array)
  }
  const dagEthAccountSerialization = encode(expectedDagEthAccount)

  test('.encode', () => {
    same(bytes.isBinary(dagEthAccountSerialization), true)
    same(dagEthAccountSerialization, expectedSerialization)
  })

  test('.decode', () => {
    same(dagEthAccount, expectedDagEthAccount)
  })

  test('round trip', () => {
    same(expectedSerialization, roundTripSerialization)
  })
})
