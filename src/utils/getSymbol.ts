import { hexToBn } from '@polkadot/util'
import { TTokenInfo } from '../types/AssetInfo'

export const getSymbol = (
  symbol: string,
  assets: {
    [id: string]: TTokenInfo
  }
) => {
  return symbol
    .split('-')
    .map((item) => item.replace('TKN', ''))
    .map((tokenId) => (tokenId.startsWith('0x') ? hexToBn(tokenId).toString() : tokenId))
    .reduce((acc, curr, idx, arr) => {
      const isSymbol = isNaN(+curr)
      return (
        acc +
        (isSymbol ? curr : assets[curr] ? assets[curr].symbol : 'N/A') +
        (idx < arr.length - 1 ? (idx % 2 === 0 ? '-' : ' / ') : '')
      )
    }, '')
}
