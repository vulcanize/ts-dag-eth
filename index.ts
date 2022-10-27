import * as dagEthHeader from './header/src'
import * as dagEthLog from './log/src'
import * as dagEthLogTrie from './log_trie/src'
import * as dagEthRct from './rct/src'
import * as dagEthRctTrie from './rct_trie/src'
import * as dagStateAccount from './state_account/src'
import * as dagEthStateTrie from './state_trie/src'
import * as dagEthStorageTrie from './storage_trie/src'
import * as dagEthTx from './tx/src'
import * as dagEthTxTrie from './tx_trie/src'
import * as dagEthUncles from './uncles/src'
import { BlockCodec } from 'multiformats/codecs/interface'
import { CodecCode } from 'multicodec'

export const codecs = [dagEthHeader, dagEthLog, dagEthLogTrie, dagEthRct, dagEthRctTrie, dagStateAccount,
  dagEthStateTrie, dagEthStorageTrie, dagEthTx, dagEthTxTrie, dagEthUncles].reduce<Record<string, BlockCodec<CodecCode,
  any>>>((acc: Record<string, BlockCodec<CodecCode, any>>, val: BlockCodec<CodecCode, any>) => {
    acc[val.name] = val
    return acc
  }, <Record<string, BlockCodec<CodecCode, any>>>{})

export const codecsByCode = [dagEthHeader, dagEthLog, dagEthLogTrie, dagEthRct, dagEthRctTrie, dagStateAccount,
  dagEthStateTrie, dagEthStorageTrie, dagEthTx, dagEthTxTrie, dagEthUncles].reduce<Record<CodecCode, BlockCodec<CodecCode,
  any>>>((acc: Record<CodecCode, BlockCodec<CodecCode, any>>, val: BlockCodec<CodecCode, any>) => {
    acc[val.code] = val
    return acc
  }, <Record<CodecCode, BlockCodec<CodecCode, any>>>{})
