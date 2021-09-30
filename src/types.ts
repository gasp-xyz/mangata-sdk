import { ApiPromise } from '@polkadot/api'
import { GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { Signer, Codec } from '@polkadot/types/types'
import type { Event, Phase } from '@polkadot/types/interfaces'
import BN from 'bn.js'

export type TxOptions = Partial<{
  nonce: BN
  signer: Signer
}>

export interface MangataEventData {
  type: string
  data: Codec
}

export interface MangataGenericEvent extends GenericEvent {
  event: Event
  phase: Phase
  section: string
  method: string
  metaDocumentation: string
  eventData: MangataEventData[]
}

export interface Itx {
  createPool(
    api: ApiPromise,
    account: KeyringPair | string,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  sellAsset(
    api: ApiPromise,
    account: KeyringPair | string,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  buyAsset(
    api: ApiPromise,
    account: KeyringPair | string,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  mintLiquidity(
    api: ApiPromise,
    account: KeyringPair | string,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  burnLiquidity(
    api: ApiPromise,
    account: KeyringPair | string,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  createToken(
    api: ApiPromise,
    targetAddress: string,
    sudoAccount: KeyringPair | string,
    currencyValue: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  mintAsset(
    api: ApiPromise,
    sudoAccount: KeyringPair | string,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  transferToken(
    api: ApiPromise,
    account: KeyringPair | string,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
  transferAllToken(
    api: ApiPromise,
    account: KeyringPair | string,
    assetId: BN,
    targetAddress: string,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]>
}

export interface Database {
  hasAddressNonce(address: string): boolean
  setNonce(address: string, nonce: BN): void
  getNonce(address: string): BN
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
}

// RPC methods types
export type ChainType = (api: ApiPromise) => Promise<string>
export type NodeNameType = (api: ApiPromise) => Promise<string>
export type NodeVersionType = (api: ApiPromise) => Promise<string>
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

// TX types

export type CreateTokenType = (
  api: ApiPromise,
  targetAddress: string,
  sudoAccount: KeyringPair | string,
  currencyValue: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type CreatePoolType = (
  api: ApiPromise,
  account: KeyringPair | string,
  firstAssetId: string,
  firstAssetAmount: BN,
  secondAssetId: string,
  secondAssetAmount: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type SellAssetType = (
  api: ApiPromise,
  account: KeyringPair | string,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  minAmountOut: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type BuyAssetType = (
  api: ApiPromise,
  account: KeyringPair | string,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  maxAmountIn: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type MintLiquidityType = (
  api: ApiPromise,
  account: KeyringPair | string,
  firstAssetId: string,
  secondAssetId: string,
  firstAssetAmount: BN,
  expectedSecondAssetAmount: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type BurnLiquidityType = (
  api: ApiPromise,
  account: KeyringPair | string,
  firstAssetId: string,
  secondAssetId: string,
  liquidityAssetAmount: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type MintAssetType = (
  api: ApiPromise,
  sudoAccount: KeyringPair | string,
  assetId: BN,
  targetAddress: string,
  amount: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type TransferTokenType = (
  api: ApiPromise,
  account: KeyringPair | string,
  tokenId: BN,
  targetAddress: string,
  amount: BN,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>

export type TransferAllTokenType = (
  api: ApiPromise,
  account: KeyringPair | string,
  tokenId: BN,
  targetAddress: string,
  txOptions?: TxOptions
) => Promise<MangataGenericEvent[]>
