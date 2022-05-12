'use strict'
/* eslint-env mocha */
describe('utils', () => {
  require('../util/test/test_util.ts')
})
describe('eth-header', () => {
  require('../header/test/test_basic.ts')
})
describe('eth-log', () => {
  require('../log/test/test_basic.ts')
})
describe('eth-rct', () => {
  require('../rct/test/test_basic.ts')
})
/*
describe('eth-tx', () => {
  require('../tx/test/test_basic.ts')
})
describe('eth-rct', () => {
  require('../rct/test/test_basic.ts')
})
describe('eth-account', () => {
  require('../state_account/test/test_basic.ts')
})
*/
