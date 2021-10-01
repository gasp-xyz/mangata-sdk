import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Amount } from '../../types/Amount'
import { TokenId } from '../../types/TokenId'

export function sellAsset(
  api: ApiPromise,
  soldTokenId: TokenId,
  boughtTokenId: TokenId,
  amount: Amount,
  minAmountOut: Amount
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
}
