import { ApiPromise } from '@polkadot/api'

export const liquidityAssetsMap = async (api: ApiPromise) => {
  const liquidityAssetsResponse = await api.query.xyk.liquidityAssets.entries()

  return liquidityAssetsResponse.reduce((acc, [key, value]) => {
    const identificator = key.args.map((k) => k.toHuman())[0] as string
    const liquidityAssetId = value.toString().replace(/[, ]/g, '')
    acc[identificator] = liquidityAssetId
    return acc
  }, {} as { [identificator: string]: string })
}
