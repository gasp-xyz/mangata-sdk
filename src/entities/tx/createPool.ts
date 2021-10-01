import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Pool } from '../../types/Pool'

export function createPool(api: ApiPromise, pool: Pool): SubmittableExtrinsic<'promise'> {
  return api.tx.xyk.createPool(
    pool.firstTokenId,
    pool.firstTokenAmount,
    pool.secondTokenId,
    pool.secondTokenAmount
  )
}
