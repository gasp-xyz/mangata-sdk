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

export type TBalance = {
  [id: string]: BN
}
