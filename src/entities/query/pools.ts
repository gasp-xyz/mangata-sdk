import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import { TokensId } from '../../types/TokensId'

export function getAmountOfTokens(api: ApiPromise, tokens: TokensId): Promise<Codec> {
  return api.query.xyk.pools([tokens.first, tokens.second])
}
