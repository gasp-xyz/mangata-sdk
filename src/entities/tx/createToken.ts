import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function createToken(
  api: ApiPromise,
  address: string,
  tokenValue: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.sudo.sudo(api.tx.tokens.create(address, tokenValue))
}
