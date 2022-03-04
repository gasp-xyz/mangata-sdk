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
  },
}
