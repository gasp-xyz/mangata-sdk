import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Amount } from '../../types/Amount'
import { TokensId } from '../../types/TokensId'

export function burnLiquidity(
  api: ApiPromise,
  tokens: TokensId,
  liquidityTokenAmount: Amount
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.burnLiquidity(tokens.first, tokens.second, liquidityTokenAmount)
}
