import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function createPool(
  api: ApiPromise,
  firstTokenId: string,
  firstTokenAmount: BN,
  secondTokenId: string,
  secondTokenAmount: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount)
}
