import { ApiPromise } from '@polkadot/api'
import { Amount } from '../../types/Amount'
import TokensId from '../../types/TokensId'

export function calculateSellPriceId(api: ApiPromise, tokens: TokensId, amount: Amount) {
  return (api.rpc as any).xyk.calculate_sell_price_id(tokens.first, tokens.second, amount)
}
