import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getTokenInfo(api: ApiPromise, tokenId: string): Promise<Codec> {
  return api.query.assetsInfo.assetsInfo(tokenId)
}
