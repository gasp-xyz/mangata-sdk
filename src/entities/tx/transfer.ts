import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function transferToken(
  api: ApiPromise,
  address: string,
  tokenId: string,
  amount: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.tokens.transfer(address, tokenId, amount)
}
