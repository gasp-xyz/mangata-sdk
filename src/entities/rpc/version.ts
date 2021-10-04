import { ApiPromise } from '@polkadot/api'
import type { Text } from '@polkadot/types'

export function getNodeVersion(api: ApiPromise): Promise<Text> {
  return api.rpc.system.version()
}
