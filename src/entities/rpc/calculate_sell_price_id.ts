import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export function calculateSellPriceId(
  api: ApiPromise,
  firstTokenId: string,
  secondTokenId: string,
  amount: BN
) {
  return (api.rpc as any).xyk.calculate_sell_price_id(firstTokenId, secondTokenId, amount)
}
