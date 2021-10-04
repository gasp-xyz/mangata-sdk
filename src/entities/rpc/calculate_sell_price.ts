import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export function calculateSellPrice(
  api: ApiPromise,
  inputReserve: BN,
  outputReserve: BN,
  amount: BN
) {
  return (api.rpc as any).xyk.calculate_sell_price(inputReserve, outputReserve, amount)
}
