import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Amount } from '../../types/Amount'

export function createToken(
  api: ApiPromise,
  address: string,
  tokenValue: Amount
): SubmittableExtrinsic<'promise'> {
  return api.tx.sudo.sudo(api.tx.tokens.create(address, tokenValue))
}
