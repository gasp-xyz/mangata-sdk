import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getNextToken(api: ApiPromise): Promise<Codec> {
  return api.query.tokens.nextCurrencyId()
}
