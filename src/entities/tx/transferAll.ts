import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { TokenId } from '../../types/TokenId'

export function transferAllToken(
  api: ApiPromise,
  address: string,
  tokenId: TokenId
): SubmittableExtrinsic<'promise'> {
  return api.tx.tokens.transferAll(address, tokenId)
}
