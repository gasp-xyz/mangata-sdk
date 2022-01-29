import BN from 'bn.js'

export type TToken = {
  id: TTokenId
  chainId: number
  name: TTokenName
  symbol: TTokenSymbol
  address: TTokenAddress
  decimals: number
  balance: BN
}

export type TTokenMainInfo = Omit<TToken, 'id' | 'balance' | 'chainId'>
export type TTokenInfo = Omit<TToken, 'balance'>
export type TTokenId = string
export type TTokenAddress = string
export type TTokenName = string
export type TTokenSymbol = string
export type TFreeBalance = BN
export type TReservedBalance = BN
export type TFrozenBalance = BN

export type TTokens = Record<TTokenId, TToken>
export type TBalances = Record<TTokenId, BN>
export type TBridgeIds = Record<TTokenId, TTokenAddress>
export type TBridgeAddresses = Record<TTokenAddress, TTokenId>
export type TBridgeTokens = Record<TTokenId, TTokenInfo>
export type TMainTokens = Record<TTokenId, TTokenInfo>

export type TPool = {
  firstTokenId: TTokenId
  secondTokenId: TTokenId
  firstTokenAmount: BN
  secondTokenAmount: BN
  liquidityTokenId: TTokenId
}

export type TPoolWithShare = TPool & {
  share: BN
  firstTokenRatio: BN
  secondTokenRatio: BN
}

export type TPoolWithRatio = TPool & {
  firstTokenRatio: BN
  secondTokenRatio: BN
}

export type TokenBalance = {
  free: TFreeBalance
  reserved: TReservedBalance
  frozen: TFreeBalance
}
