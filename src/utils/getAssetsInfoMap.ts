import { ApiPromise } from '@polkadot/api'
import { TAssetMainInfo, TAssetInfo } from '../types/AssetInfo'

export const getAssetsInfoMap = async (api: ApiPromise) => {
  const assetsInfoResponse = await api.query.assetsInfo.assetsInfo.entries()

  const assetsInfoMap = new Map<string, TAssetInfo>()
  assetsInfoResponse.forEach(([key, value]) => {
    const info = value.toHuman() as TAssetMainInfo
    const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
    assetsInfoMap.set(id, {
      id: (key.toHuman() as string[])[0].replace(/[, ]/g, ''),
      symbol: info.symbol,
      description: info.description,
      name: info.name,
      decimals: Number(info.decimals),
    })
  })

  const result = Array.from(assetsInfoMap).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as { [id: string]: TAssetInfo })

  return result
}
