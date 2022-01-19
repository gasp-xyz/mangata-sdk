import { ApiPromise } from '@polkadot/api'

export const liquidityAssetsMap = async (api: ApiPromise) => {
  const liquidityAssetsResponse = await api.query.xyk.liquidityAssets.entries()

  const liquidityAssetsMap = new Map<string, string>()
  liquidityAssetsResponse.forEach(([key, value]) => {
    const identificator = key.args.map((k) => k.toHuman())[0] as string
    const liquidityAssetId = value.toString().replace(/[, ]/g, '')
    liquidityAssetsMap.set(identificator, liquidityAssetId)
  })

  const result = Array.from(liquidityAssetsMap).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as { [identificator: string]: string })

  return result
}
