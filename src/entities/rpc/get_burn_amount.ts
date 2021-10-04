import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export function getBurnAmount(
  api: ApiPromise,
  firstTokenId: string,
  secondTokenId: string,
  amount: BN
) {
  return (api.rpc as any).xyk.get_burn_amount(firstTokenId, secondTokenId, amount)
}
