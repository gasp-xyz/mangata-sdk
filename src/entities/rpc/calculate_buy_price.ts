import { ApiPromise } from '@polkadot/api'
import { Amount } from '../../types/Amount'
import { Reserve } from '../../types/Reserve'

export function calculateBuyPrice(api: ApiPromise, reserve: Reserve, amount: Amount) {
  return (api.rpc as any).xyk.calculate_buy_price(reserve.input, reserve.output, amount)
}
