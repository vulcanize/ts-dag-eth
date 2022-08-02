import chai, { expect } from 'chai'
import { encode, decode, rawCode } from '../src/index'
import { prepare, validate } from '../src/util'
import * as fs from 'fs'
import { Account } from '../src/interface'
import { Account as EthAccount } from 'ethereumjs-util/dist/account'
import { cidFromHash } from '../../util/src/util'
import { code as storageTrieCode } from '../../storage_trie/src'
import { checkEquality } from './util'

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
    checkEquality(expectedAccountNode, preparedAccount)
    expect(() => validate(preparedAccount)).to.not.throw()
  })
})
