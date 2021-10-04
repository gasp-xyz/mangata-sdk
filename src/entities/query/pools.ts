import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getAmountOfTokens(
  api: ApiPromise,
  firstTokenId: string,
  secondTokenId: string
): Promise<Codec> {
  return api.query.xyk.pools([firstTokenId, secondTokenId])
}
