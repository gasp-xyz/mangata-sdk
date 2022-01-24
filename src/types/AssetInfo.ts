import BN from 'bn.js'

export type TAsset = {
  id: string
  chainId: number
  name: string
  symbol: string
  address: string
  decimals: number
  balance: BN
}

export type TAssetMainInfo = Omit<TAsset, 'id' | 'balance' | 'chainId'>
export type TAssetInfo = Omit<TAsset, 'balance'>

export type TBalances = {
  [id: string]: BN
}

export type TBridgeIds = {
  [id: string]: string
}

export type TBridgeTokens = {
  [id: string]: TAssetInfo
}

export type TMainAssets = {
  [id: string]: TAssetInfo
}

export type TPool = {
  firstToken: string
  secondToken: string
  firstTokenAmount: BN
  secondTokenAmount: BN
  liquidityTokenId: string
}

export type TLiquidityAssets = {
  [identificator: string]: string
}

export type TokenBalance = {
  free: BN
  reserved: BN
  frozen: BN
}
