import { ApiPromise } from '@polkadot/api'
import { GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { Signer } from '@polkadot/types/types'
import BN from 'bn.js'

export type TxOptions = Partial<{
  nonce: BN
  signer: Signer
}>

export enum ExtrinsicResult {
  ExtrinsicSuccess,
  ExtrinsicFailed,
  ExtrinsicUndefined,
}

export interface Itx {
  createPool(
    api: ApiPromise,
    keyringPair: KeyringPair,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  sellAsset(
    api: ApiPromise,
    keyringPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  buyAsset(
    api: ApiPromise,
    keyringPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  mintLiquidity(
    api: ApiPromise,
    keyringPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  burnLiquidity(
    api: ApiPromise,
    keyringPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  createToken(
    api: ApiPromise,
    targetAddress: string,
    sudoKeyringPair: KeyringPair,
    currencyValue: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  mintAsset(
    api: ApiPromise,
    sudo: KeyringPair,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  transferToken(
    api: ApiPromise,
    account: KeyringPair,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
  transferAllToken(
    api: ApiPromise,
    account: KeyringPair,
    assetId: BN,
    targetAddress: string,
    txOptions?: TxOptions
  ): Promise<GenericEvent[]>
}

export interface Database {
  hasAddressNonce(address: string): boolean
  setNonce(address: string, nonce: BN): void
  getNonce(address: string): BN
}

export interface Iquery {
  getNonce(api: ApiPromise, address: string): Promise<BN>
  getAmountOfTokenIdInPool(api: ApiPromise, firstTokenId: BN, secondTokenId: BN): Promise<BN>
  getLiquidityAssetId(api: ApiPromise, firstTokenId: BN, secondTokenId: BN): Promise<BN>
  getLiquidityPool(api: ApiPromise, liquidityAssetId: BN): Promise<BN[]>
  getTreasury(api: ApiPromise, currencyId: BN): Promise<BN>
  getTreasuryBurn(api: ApiPromise, currencyId: BN): Promise<BN>
  getTotalIssuanceOfTokenId(api: ApiPromise, tokenId: BN): Promise<BN>
  getLock(api: ApiPromise, address: string, tokenId: BN): any
}

export interface Irpc {
  getChain(api: ApiPromise): Promise<string>
  getNodeName(api: ApiPromise): Promise<string>
  getNodeVersion(api: ApiPromise): Promise<string>
  calculateBuyPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    buyAmount: BN
  ): Promise<BN>
  calculateSellPrice(
    api: ApiPromise,
    inputReserve: BN,
    outputReserve: BN,
    sellAmount: BN
  ): Promise<BN>
  getTokensRequiredForMinting(
    api: ApiPromise,
    liquidityAssetId: BN,
    liquidityAssetAmount: BN
  ): Promise<any>
  getBurnAmount(
    api: ApiPromise,
    firstAssetId: BN,
    secondAssetId: BN,
    liquidityAssetAmount: BN
  ): Promise<any>
  calculateSellPriceId(
    api: ApiPromise,
    soldTokenId: BN,
    boughtTokenId: BN,
    sellAmount: BN
  ): Promise<BN>
  calculateBuyPriceId(
    api: ApiPromise,
    soldTokenId: BN,
    boughtTokenId: BN,
    buyAmount: BN
  ): Promise<BN>
  getLiquidityAsset(api: ApiPromise, firstTokenId: BN, secondTokenId: BN): Promise<any>
}

// Query methods types
export type NonceType = (api: ApiPromise, address: string) => Promise<BN>
export type AmountOfTokenIdInPoolType = (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
) => Promise<BN>
export type LiquidityAssetIdType = (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
) => Promise<BN>
export type LiquidityPoolType = (api: ApiPromise, liquidityAssetId: BN) => Promise<BN[]>
export type TreasuryType = (api: ApiPromise, currencyId: BN) => Promise<BN>
export type TreasuryBurnType = (api: ApiPromise, currencyId: BN) => Promise<BN>
export type TotalIssuanceOfTokenIdType = (api: ApiPromise, tokenId: BN) => Promise<BN>
export type LockType = (api: ApiPromise, address: string, tokenId: BN) => Promise<any>

// RPC methods types
export type ChainType = (api: ApiPromise) => Promise<string>
export type NodeNameType = (api: ApiPromise) => Promise<string>
export type NodeVersionType = (api: ApiPromise) => Promise<string>
export type TokensRequiredForMintingType = (
  api: ApiPromise,
  liquidityAssetId: BN,
  liquidityAssetAmount: BN
) => Promise<any>
export type CalculateBuyPriceType = (
  api: ApiPromise,
  inputReserve: BN,
  outputReserve: BN,
  buyAmount: BN
) => Promise<BN>
export type CalculateSellPriceType = (
  api: ApiPromise,
  inputReserve: BN,
  outputReserve: BN,
  sellAmount: BN
) => Promise<BN>
export type BurnAmountType = (
  api: ApiPromise,
  firstAssetId: BN,
  secondAssetId: BN,
  liquidityAssetAmount: BN
) => any
export type CalculateSellPriceIdType = (
  api: ApiPromise,
  soldTokenId: BN,
  boughtTokenId: BN,
  sellAmount: BN
) => Promise<BN>
export type CalculateBuyPriceIdType = (
  api: ApiPromise,
  soldTokenId: BN,
  boughtTokenId: BN,
  buyAmount: BN
) => Promise<BN>
export type LiquidityAssetType = (
  api: ApiPromise,
  firstTokenId: BN,
  secondTokenId: BN
) => Promise<any>
