import type { RegistryTypes } from '@polkadot/types/types'

const typesOptions: RegistryTypes = {
  CurrencyId: 'u32',
  CurrencyIdOf: 'u32',
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  TokenId: 'u32',
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
}

const OldtypesOptions: RegistryTypes = {
  CurrencyId: 'u32',
  CurrencyIdOf: 'u32',
  Address: 'AccountId',
  Balance: 'u128',
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
  AccountInfo: {
    nonce: 'u32',
    refcount: 'u32',
    data: 'BalancesAccountData',
  },
  RpcResult: {
    price: 'Balance',
  },
  RPCAmountsResult: {
    firstAssetAmount: 'Balance',
    secondAssetAmount: 'Balance',
  },
  BalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    misc_frozen: 'u128',
    fee_frozen: 'u128',
  },
  AssetAccountData: {
    free: 'U256',
  },
  AccountData: {
    free: 'u128',
    reserved: 'u128',
    frozen: 'u128',
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
  App: {
    _enum: ['ETH', 'ERC20'],
  },
  SeedType: {
    seed: '[u8; 32]',
    proof: '[u8; 64]',
  },
  Bloom: {
    _: '[u8; 256]',
  },
  Valuation: {
    liquidity_token_amount: 'Balance',
    mng_valuation: 'Balance',
  },
  ShufflingSeed: {
    seed: 'H256',
    proof: 'H512',
  },
  BalanceLock: {
    id: '[u8; 8]',
    amount: 'Balance',
  },
  Header: {
    parentHash: 'Hash',
    number: 'Compact<BlockNumber>',
    stateRoot: 'Hash',
    extrinsicsRoot: 'Hash',
    digest: 'Digest',
    seed: 'ShufflingSeed',
  },
  TxnRegistryDetails: {
    doubly_encrypted_call: 'Vec<u8>',
    user: 'AccountId',
    nonce: 'Index',
    weight: 'Weight',
    builder: 'AccountId',
    executor: 'AccountId',
    singly_encrypted_call: 'Option<Vec<u8>>',
    decrypted_call: 'Option<Vec<u8>>',
    doubly_encrypted_nonce: 'Option<Vec<u8>>',
    singly_encrypted_nonce: 'Option<Vec<u8>>',
  },
  AuthorityId: '[u8; 33]',
  VectorOfCalls: 'Vec<Call>',
  VectorOfVecu8: 'Vec<Vec<u8>>',
}

export default typesOptions
