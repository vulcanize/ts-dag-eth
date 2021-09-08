import * as chai from 'chai'
import chaiSubset from 'chai-subset'
import { CID } from 'multiformats/cid'
import { hexToBytes } from 'web3-utils'
import { cidFromHash, hashFromCID } from '../src/util'
import { code as headerCode } from '../../header/src/index'
import { code as txCode } from '../../tx/src/index'

chai.use(chaiSubset)
const { assert } = chai

const mockHeaderCID = CID.parse('bagiacgza5dfagebnlwf6b4qci6lys4mu4pdao4i6lmzpuwcaunasa4bvgmoq')
const mockHeaderHash = Uint8Array.from(hexToBytes('0xe8ca03102d5d8be0f2024797897194e3c607711e5b32fa5840a341207035331d'))
const mockTxCID = CID.parse('bagjqcgza5hpu6wcef46fw2nlom6aiqorhrqjikmanssb4oauzktgumklsyja')
const mockTxHash = Uint8Array.from(hexToBytes('0xe9df4f58442f3c5b69ab733c0441d13c609429806ca41e3814caa66a314b9612'))

describe('Basics', () => {
  it('generates a cid from a header keccak256 hash', () => {
    const cid = cidFromHash(headerCode, mockHeaderHash)
    assert.deepEqual(cid, mockHeaderCID)
  })

  it('returns the keccak256 header hash from a cid', () => {
    const hash = hashFromCID(mockHeaderCID)
    assert.deepEqual(hash, mockHeaderHash)
  })

  it('generates a cid from a tx keccak256 hash', () => {
    const cid = cidFromHash(txCode, mockTxHash)
    assert.deepEqual(cid, mockTxCID)
  })

  it('returns the keccak256 tx hash from a cid', () => {
    const hash = hashFromCID(mockTxCID)
    assert.deepEqual(hash, mockTxHash)
  })
})
