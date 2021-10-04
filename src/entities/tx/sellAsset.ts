import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function sellAsset(
  api: ApiPromise,
  soldTokenId: string,
  boughtTokenId: string,
  amount: BN,
  minAmountOut: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
}
