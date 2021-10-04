import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getTotalIssuance(api: ApiPromise, tokenId: string): Promise<Codec> {
  return api.query.tokens.totalIssuance(tokenId)
}
