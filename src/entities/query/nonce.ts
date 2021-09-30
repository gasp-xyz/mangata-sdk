import { ApiPromise } from '@polkadot/api'
import type { AccountInfo } from '@polkadot/types/interfaces'

export function getNonce(api: ApiPromise, address: string): Promise<AccountInfo> {
  return api.query.system.account(address)
}
