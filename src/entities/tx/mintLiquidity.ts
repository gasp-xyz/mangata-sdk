import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function mintLiquidity(
  api: ApiPromise,
  firstTokenId: string,
  secondTokenId: string,
  firstTokenAmount: BN,
  expectedSecondTokenAmount: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.mintLiquidity(
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount
  )
}
