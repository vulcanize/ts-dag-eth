# ts-dag-eth
A TypeScript implementation of the codecs for [Ethereum IPLD types](https://github.com/ipld/ipld/tree/master/specs/codecs/dag-eth)
for use with [multiformats](https://github.com/multiformats/js-multiformats).

## Testing
After running `npm install` or `npm ci`, run `npm test` or `yarn test` from the root repo to run all the unit tests referenced from [test/index.ts](test/index.ts)

## Usage
The top-level index contains a mapping that aggregates all the ethereum codecs:
```javascript
import { codecs } from '@vulcanize/dag-eth/'
import { Transaction } from '@vulcanize/dag-eth/tx/src/interface'
import { Receipt } from '@vulcanize/dag-eth/rct/src/interface'
import { CodecCode } from 'multicodec'

const txName = 'eth-tx'
const rctName = 'eth-rct'
const txCode: CodecCode = 0x93
const rctCode: CodecCode = 0x95
const txCodec = codecs[txName]
const rctCodec = codecs[rctName]
const accessListTxNode: Transaction = txCodec.decode(accessListTxEnc)
const dynamicFeeRctNode: Receipt = rctCodec.decode(dyanamicFeeRctEnc)
const accessListTxNodeEnc = txCodec.encode(accessListTxNode)
const dynamicFeeRctNodeEnc = rctCodec.encode(dynamicFeeRctNode)

// accessListTxEnc == accessListTxNodeEnc
// dyanamicFeeRctEnc == dynamicFeeRctNodeEnc
// txCode == txCodec.code
// rctCode == rctCodec.code
// txName == txCodec.name
// rctName == rctCodec.name
```

Or, you can import the individual codec pkgs:

```javascript
import { encode as txEncode, decode as txDecode } from '@vulcanize/dag-eth/tx/src/'
import { encode as rctEncode, decode as rctDecode } from '@vulcanize/dag-eth/rct/src'
import { Transaction } from '@vulcanize/dag-eth/tx/src/interface'
import { Receipt } from '@vulcanize/dag-eth/rct/src/interface'

const accessListTxNode: Transaction = txDecode(accessListTxEnc)
const dynamicFeeRctNode: Receipt = rctDecode(dyanamicFeeRctEnc)
const accessListTxNodeEnc = txEncode(accessListTxNode)
const dynamicFeeRctNodeEnc = rctEncode(dynamicFeeRctNode)

// accessListTxEnc == accessListTxNodeEnc
// dyanamicFeeRctEnc == dynamicFeeRctNodeEnc
```
