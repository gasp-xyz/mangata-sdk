import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function burnLiquidity(
  api: ApiPromise,
  firstTokenId: string,
  secondTokenId: string,
  liquidityTokenAmount: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, liquidityTokenAmount)
}
