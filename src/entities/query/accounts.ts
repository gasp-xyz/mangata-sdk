import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getTokenBalance(api: ApiPromise, address: string, tokenId: string): Promise<Codec> {
  return api.query.tokens.accounts(address, tokenId)
}
