import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Amount } from '../../types/Amount'
import { TokenId } from '../../types/TokenId'

export function transferToken(
  api: ApiPromise,
  address: string,
  tokenId: TokenId,
  amount: Amount
): SubmittableExtrinsic<'promise'> {
  return api.tx.tokens.transfer(address, tokenId, amount)
}
