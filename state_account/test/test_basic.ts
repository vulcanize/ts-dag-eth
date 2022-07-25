import chai, { expect } from 'chai'
import { encode, decode, rawCode } from '../src/index'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { Account } from '../src/interface'
import { CID } from 'multiformats/cid'
import BN from 'bn.js'
import { Account as EthAccount } from 'ethereumjs-util/dist/account'
import { cidFromHash } from '../../util/src/util'
import { code as storageTrieCode } from '../../storage_trie/src'

const { assert } = chai
const test = it
const same = assert.deepEqual

const stateAccountRLPFileName = 'state_account_rlp'

describe('eth-account-snapshot', function () {
  const dirname = __dirname.concat('/', stateAccountRLPFileName)
  const accountRLP = fs.readFileSync(dirname)
  const account: EthAccount = EthAccount.fromRlpSerializedAccount(accountRLP)
  const expectedAccountNode: Account = {
    Nonce: account.nonce,
    Balance: account.balance,
    StorageRootCID: cidFromHash(storageTrieCode, account.stateRoot),
    CodeCID: cidFromHash(rawCode, account.codeHash)
  }
  const anyAccount: any = {
    Nonce: expectedAccountNode.Nonce.toString('hex'),
    Balance: expectedAccountNode.Balance.toString(),
    StorageRootCID: expectedAccountNode.StorageRootCID.toString(),
    CodeCID: expectedAccountNode.CodeCID.toString()
  }

  test('encode and decode round trip', () => {
    const accountNode: Account = decode(accountRLP)
    same(accountNode, expectedAccountNode)
    const accountEnc = encode(accountNode)
    same(accountEnc, accountRLP)
  })

  test('prepare and validate', () => {
    expect(() => validate(anyAccount as any)).to.throw()
    const preparedAccount = prepare(anyAccount)
    for (const [k, v] of Object.entries(expectedAccountNode)) {
      if (Object.prototype.hasOwnProperty.call(preparedAccount, k)) {
        const actualVal = preparedAccount[k as keyof Account]
        if (v instanceof CID) {
          if (actualVal instanceof CID) {
            assert.equal(actualVal.toString(), v.toString(), `actual ${k}: ${actualVal.toString()} does not equal expected: ${v.toString()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type CID`)
          }
        } else if (v instanceof BN) {
          if (actualVal instanceof BN) {
            assert.equal(v.toNumber(), actualVal.toNumber(), `actual ${k}: ${actualVal.toNumber()} does not equal expected: ${v.toNumber()}`)
          } else {
            throw new TypeError(`key ${k} expected to be of type BN`)
          }
        } else {
          assert.equal(preparedAccount[k as keyof Account], v, `actual ${k}: ${preparedAccount[k as keyof Account]} does not equal expected: ${v}`)
        }
      } else {
        throw new Error(`key ${k} found in expectedAccountNode is not found in the preparedAccount`)
      }
    }
    expect(() => validate(preparedAccount)).to.not.throw()
  })
})
