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

export type TBalances = {
  [id: TTokenId]: BN
}

export type TBridgeIds = {
  [id: TTokenId]: TTokenAddress
}

export type TBridgeAddresses = {
  [id: TTokenAddress]: TTokenId
}

export type TBridgeTokens = {
  [id: TTokenId]: TTokenInfo
}

export type TMainTokens = {
  [id: TTokenId]: TTokenInfo
}

export type TPool = {
  firstTokenId: TTokenId
  secondTokenId: TTokenId
  firstTokenAmount: BN
  secondTokenAmount: BN
  liquidityTokenId: TTokenId
}

export type TokenBalance = {
  free: BN
  reserved: BN
  frozen: BN
}
