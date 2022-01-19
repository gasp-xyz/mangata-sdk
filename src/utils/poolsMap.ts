import { TPool } from '../types/AssetInfo'

export const poolsMap = (pools: TPool[]) => {
  const poolsMap = new Map<string, TPool>()
  pools.forEach((item) => poolsMap.set(item.liquidityTokenId, item))

  return Array.from(poolsMap).reduce(
    (obj, [key, value]) => {
      obj[key] = value
      return obj
    },
    {} as {
      [id: string]: TPool
    }
  )
}
