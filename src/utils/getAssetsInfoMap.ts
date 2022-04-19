import { ApiPromise } from '@polkadot/api'
import { TTokenInfo, TTokenId } from '../types'
import { getCorrectSymbol } from './getCorrectSymbol'

const ETHaddress = '0x0000000000000000000000000000000000000000'
const MGAaddress = '0xc7e3bda797d2ceb740308ec40142ae235e08144a'

export const getAssetsInfoMap = async (api: ApiPromise) => {
  const assetsInfoResponse = await api.query.assetsInfo.assetsInfo.entries()

  const result = assetsInfoResponse.reduce((obj, [key, value]) => {
    const info = value.toHuman() as {
      symbol: string
      name: string
      description: string
      decimals: number
    }
    const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')

    const assetInfo = {
      id,
      chainId: 0,
      symbol: info.symbol,
      address: info.description,
      name: info.symbol.includes('TKN') ? 'Liquidity Pool Token' : info.name,
      decimals: Number(info.decimals),
    }

    obj[id] = assetInfo
    return obj
  }, {} as { [id: TTokenId]: TTokenInfo })

  // from assets info we receive liquidity tokens in the format
  // TKN0x000003CD-TKN0x00000000
  // therefore we need to parse this to tokens ids
  // TKN0x000003CD-TKN0x00000000 -> 13-4 -> 'm12-MGA / mDOT'
  return Object.values(result).reduce((obj, item) => {
    const asset = {
      ...item,
      symbol: item.symbol.includes('TKN') ? getCorrectSymbol(item.symbol, result) : item.symbol,
      address:
        item.symbol === 'MGA' ? MGAaddress : item.symbol === 'ETH' ? ETHaddress : item.address,
    }
    obj[item.id] = asset
    return obj
  }, {} as { [id: TTokenId]: TTokenInfo })
}
