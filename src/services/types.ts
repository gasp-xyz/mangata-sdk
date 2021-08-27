import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export type txOptions = Partial<{
  nonce: BN
}>

export type Itx = {
  createPool(
    api: ApiPromise,
    address: string,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<void>
  sellAsset(
    api: ApiPromise,
    address: string,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: txOptions
  ): Promise<void>
  buyAsset(
    api: ApiPromise,
    address: string,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: txOptions
  ): Promise<void>
  mintLiquidity(
    api: ApiPromise,
    address: string,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<void>
  burnLiquidity(
    api: ApiPromise,
    address: string,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<void>
}
