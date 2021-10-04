import { ApiPromise } from '@polkadot/api'
import type { Text } from '@polkadot/types'

export function getNodeName(api: ApiPromise): Promise<Text> {
  return api.rpc.system.name()
}
