import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import { TokenId } from '../../types/TokenId'

export function getLock(api: ApiPromise, address: string, tokenId: TokenId): Promise<Codec> {
  return api.query.tokens.locks(address, tokenId)
}
