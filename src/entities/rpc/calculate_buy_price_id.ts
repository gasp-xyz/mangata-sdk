import { ApiPromise } from '@polkadot/api'
import { Amount } from '../../types/Amount'
import { TokensId } from '../../types/TokensId'

export function calculateBuyPriceId(api: ApiPromise, tokens: TokensId, amount: Amount) {
  return (api.rpc as any).xyk.calculate_buy_price_id(tokens.first, tokens.second, amount)
}
