import type { RegistryTypes } from '@polkadot/types/types'

const typesOptions: RegistryTypes = {
  CurrencyIdOf: 'u32',
  CurrencyId: 'u32',
  Balance: 'u128',
  App: {
    _enum: ['ETH', 'ERC20'],
  },

  RpcResult: {
    price: 'Balance',
  },

  // mapping the actual specified address format
  Address: 'AccountId',
  // mapping the lookup
  LookupSource: 'AccountId',

  AssetInfo: {
    name: 'Option<Vec<u8>>',
    symbol: 'Option<Vec<u8>>',
    description: 'Option<Vec<u8>>',
    decimals: 'Option<u32>',
  },

  AppId: '[u8; 20]',
  Message: {
    payload: 'Vec<u8>',
    verification: 'VerificationInput',
  },
  VerificationInput: {
    _enum: {
      Basic: 'VerificationBasic',
      None: null,
    },
  },
  VerificationBasic: {
    blockNumber: 'u64',
    eventIndex: 'u32',
  },
  TokenId: 'u32',
  BridgedAssetId: 'H160',
  AssetAccountData: {
    free: 'U256',
  },
  EthereumHeader: {
    parentHash: 'H256',
    timestamp: 'u64',
    number: 'u64',
    author: 'H160',
    transactionsRoot: 'H256',
    ommersHash: 'H256',
    extraData: 'Vec<u8>',
    stateRoot: 'H256',
    receiptsRoot: 'H256',
    logBloom: 'Bloom',
    gasUsed: 'U256',
    gasLimit: 'U256',
    difficulty: 'U256',
    seal: 'Vec<Vec<u8>>',
  },
  Bloom: {
    _: '[u8; 256]',
  },
  BalanceLock: {
    id: '[u8; 8]',
    amount: 'Balance',
  },
  Valuation: {
    liquidity_token_amount: 'Balance',
    mng_valuation: 'Balance',
  },
}

export default typesOptions
