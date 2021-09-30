import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import { Token } from '../../types/Token'

export function getLock(api: ApiPromise, address: string, tokenId: Token): Promise<Codec> {
  return api.query.tokens.locks(address, tokenId)
}
