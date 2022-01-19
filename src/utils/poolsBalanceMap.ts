import { ApiPromise } from '@polkadot/api'
import { hexToBn, isHex } from '@polkadot/util'
import BN from 'bn.js'
import { TLiquidityAssets } from '../types/AssetInfo'

export const poolsBalanceMap = async (api: ApiPromise, liquidityAssets: TLiquidityAssets) => {
  const poolsBalanceResponse = await api.query.xyk.pools.entries()

  const poolsBalanceMap = new Map<string, BN[]>()
  poolsBalanceResponse.forEach(([key, value]) => {
    const identificator = key.args.map((k) => k.toHuman())[0] as string
    const balancesResponse = JSON.parse(JSON.stringify(value)) as string[]
    const balances = balancesResponse.map((balance) =>
      isHex(balance) ? hexToBn(balance) : new BN(balance)
    )
    poolsBalanceMap.set(liquidityAssets[identificator], balances)
  })

  return Array.from(poolsBalanceMap).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as { [identificator: string]: BN[] })
}
