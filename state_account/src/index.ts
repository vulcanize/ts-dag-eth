import { Account as EthAccount } from 'ethereumjs-util'
import { ByteView } from 'multiformats/codecs/interface'
import { Account as DAGAccount } from './interface'
import { cidFromHash, hashFromCID } from '../../util/src/util'
import { code as storageTrieCode } from '../../storage_trie/src/index'
import { CodecCode } from 'multicodec'
const toBuffer = require('typedarray-to-buffer')

export const name = 'eth-account-snapshot'
export const code: CodecCode = 0x97
export const rawCode: CodecCode = 0x55

export function encode (node: DAGAccount): ByteView<DAGAccount> {
  const account = EthAccount.fromAccountData({
    nonce: node.Nonce,
    balance: node.Balance,
    stateRoot: hashFromCID(node.StorageRootCID),
    codeHash: hashFromCID(node.CodeCID)
  })
  return account.serialize()
}

export function decode (bytes: ByteView<DAGAccount>): DAGAccount {
  const ethAccount = EthAccount.fromRlpSerializedAccount(toBuffer(bytes))
  return {
    Nonce: ethAccount.nonce,
    Balance: ethAccount.balance,
    StorageRootCID: cidFromHash(storageTrieCode, ethAccount.stateRoot),
    CodeCID: cidFromHash(rawCode, ethAccount.codeHash)
  }
}
