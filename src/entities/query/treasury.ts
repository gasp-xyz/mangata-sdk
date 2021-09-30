import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import { Token } from '../../types/Token'

export function getTreasury(api: ApiPromise, tokenId: Token): Promise<Codec> {
  return api.query.xyk.treasury(tokenId)
}
