import { TMainAssets } from '..'
import { getSymbol } from './getSymbol'

export const getCorrectSymbol = (symbol: string, assets: TMainAssets) => {
  const retrivedSymbol = getSymbol(symbol, assets)

  return retrivedSymbol.includes('TKN') ? getSymbol(retrivedSymbol, assets) : retrivedSymbol
}
