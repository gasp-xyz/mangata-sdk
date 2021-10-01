import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'
import TokensId from '../../types/TokensId'

export function getLiquidityAssets(api: ApiPromise, tokens: TokensId): Promise<Codec> {
  return api.query.xyk.liquidityAssets([tokens.second, tokens.second])
}
