import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import { Token } from '../../types/Token'

export function getTokenBalance(api: ApiPromise, address: string, tokenId: Token): Promise<Codec> {
  return api.query.tokens.accounts(address, tokenId)
}
