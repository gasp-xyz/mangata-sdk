import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getLock(api: ApiPromise, address: string, tokenId: string): Promise<Codec> {
  return api.query.tokens.locks(address, tokenId)
}
