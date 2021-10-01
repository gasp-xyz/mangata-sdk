import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import { TokenId } from '../../types/TokenId'

export function getTotalIssuance(api: ApiPromise, tokenId: TokenId): Promise<Codec> {
  return api.query.tokens.totalIssuance(tokenId)
}
