import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export const balancesMap = async (api: ApiPromise) => {
  const balancesResponse = await api.query.tokens.totalIssuance.entries()

  return balancesResponse.reduce((acc, [key, value]) => {
    const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
    const balance = new BN(value.toString())
    acc[id] = balance
    return acc
  }, {} as { [id: string]: BN })
}
