import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'

export function transferAllToken(
  api: ApiPromise,
  address: string,
  tokenId: string
): SubmittableExtrinsic<'promise'> {
  return api.tx.tokens.transferAll(address, tokenId)
}
