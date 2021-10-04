import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function buyAsset(
  api: ApiPromise,
  soldTokenId: string,
  boughtTokenId: string,
  amount: BN,
  maxAmountIn: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
}
