import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export const balancesMap = async (api: ApiPromise) => {
  const balancesResponse = await api.query.tokens.totalIssuance.entries()
  let balancesMap = new Map<string, BN>()
  balancesResponse.forEach(([key, exposure]) => {
    const id = (key.toHuman() as string[])[0].replace(/[, ]/g, '')
    const balance = new BN(exposure.toString())
    balancesMap.set(id, balance)
  })

  return Array.from(balancesMap).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as { [id: string]: BN })
}
