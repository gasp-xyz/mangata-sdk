import { ApiPromise } from '@polkadot/api'
import { Amount } from '../../types/Amount'
import TokensId from '../../types/TokensId'

export function getBurnAmount(api: ApiPromise, tokens: TokensId, amount: Amount) {
  return (api.rpc as any).xyk.get_burn_amount(tokens.first, tokens.second, amount)
}
