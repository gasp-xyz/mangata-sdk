import { ApiPromise } from '@polkadot/api'
import { Codec } from '@polkadot/types/types'

export function getLiquidityPool(api: ApiPromise, liquidityAssetId: string): Promise<Codec> {
  return api.query.xyk.liquidityPools(liquidityAssetId)
}
