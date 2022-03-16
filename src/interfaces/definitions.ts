export default {
  types: {
    ShufflingSeed: {
      seed: 'H256',
      proof: 'H512',
    },
    Header: {
      parentHash: 'Hash',
      number: 'Compact<BlockNumber>',
      stateRoot: 'Hash',
      extrinsicsRoot: 'Hash',
      digest: 'Digest',
      seed: 'ShufflingSeed',
      count: 'BlockNumber',
    },
    RpcResult: {
      price: 'Balance',
    },
    RPCAmountsResult: {
      firstAssetAmount: 'Balance',
      secondAssetAmount: 'Balance',
    },
    TokenId: 'u32',
  },
}
