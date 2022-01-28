import { TMainTokens } from '..'
import { TTokenSymbol } from '../types/AssetInfo'
import { getSymbol } from './getSymbol'

export const getCorrectSymbol = (symbol: string, assets: TMainTokens): TTokenSymbol => {
  const retrivedSymbol = getSymbol(symbol, assets)

  return retrivedSymbol.includes('TKN') ? getSymbol(retrivedSymbol, assets) : retrivedSymbol
}
