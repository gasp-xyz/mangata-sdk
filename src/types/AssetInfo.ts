import BN from 'bn.js'

export type TAsset = {
  id: string
  name: string
  symbol: string
  description: string
  decimals: number
  balance: BN
}

export type TAssetMainInfo = Omit<TAsset, 'id' | 'balance'>
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
