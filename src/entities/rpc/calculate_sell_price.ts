import { ApiPromise } from '@polkadot/api'
import { Amount } from '../../types/Amount'
import { Reserve } from '../../types/Reserve'

export function calculateSellPrice(api: ApiPromise, reserve: Reserve, amount: Amount) {
  return (api.rpc as any).xyk.calculate_sell_price(reserve.input, reserve.output, amount)
}
