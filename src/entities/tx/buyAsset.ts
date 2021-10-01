import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Amount } from '../../types/Amount'
import { TokenId } from '../../types/TokenId'

export function buyAsset(
  api: ApiPromise,
  soldTokenId: TokenId,
  boughtTokenId: TokenId,
  amount: Amount,
  maxAmountIn: Amount
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
}
