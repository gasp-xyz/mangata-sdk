import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

export function mintToken(
  api: ApiPromise,
  address: string,
  tokenId: string,
  amount: BN
): SubmittableExtrinsic<'promise'> {
  return api.tx.sudo.sudo(api.tx.tokens.mint(tokenId, address, amount))
}
