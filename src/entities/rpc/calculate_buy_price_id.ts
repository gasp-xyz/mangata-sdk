import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export function calculateBuyPriceId(
  api: ApiPromise,
  firstTokenId: string,
  secondTokenId: string,
  amount: BN
) {
  return (api.rpc as any).xyk.calculate_buy_price_id(firstTokenId, secondTokenId, amount)
}
