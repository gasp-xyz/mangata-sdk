import { ApiPromise } from '@polkadot/api'
import { GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import BN from 'bn.js'

export type txOptions = Partial<{
  nonce: BN
}>

export enum ExtrinsicResult {
  ExtrinsicSuccess,
  ExtrinsicFailed,
  ExtrinsicUndefined,
}

export type Itx = {
  createPool(
    api: ApiPromise,
    keyRingPair: KeyringPair,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
  sellAsset(
    api: ApiPromise,
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
  buyAsset(
    api: ApiPromise,
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
  mintLiquidity(
    api: ApiPromise,
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
  burnLiquidity(
    api: ApiPromise,
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
  createToken(
    api: ApiPromise,
    targetAddress: string,
    sudoKeyringPair: KeyringPair,
    currencyValue: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
  mintAsset(
    api: ApiPromise,
    sudo: KeyringPair,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]>
}
