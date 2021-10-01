import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Amount } from '../../types/Amount'
import { TokensId } from '../../types/TokensId'

export function mintLiquidity(
  api: ApiPromise,
  tokens: TokensId,
  firstTokenAmount: Amount,
  expectedSecondTokenAmount: Amount
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.mintLiquidity(
    tokens.first,
    tokens.second,
    firstTokenAmount,
    expectedSecondTokenAmount
  )
}
