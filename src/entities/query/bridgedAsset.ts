import { ApiPromise } from '@polkadot/api'
import type { StorageKey } from '@polkadot/types'

export function getBridgedTokens(api: ApiPromise): Promise<[StorageKey, 'Vec<u8>'][]> {
  return api.query.bridgedAsset.bridgedAsset.entries<'Vec<u8>'>()
}
