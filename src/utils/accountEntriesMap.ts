import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export const accountEntriesMap = async (api: ApiPromise, address: string) => {
  const ownedAssetsResponse = await api.query.tokens.accounts.entries(address)

  let ownedAssetsMap = new Map<string, BN>()
  ownedAssetsResponse.forEach(([key, exposure]) => {
    const id = (key.toHuman() as string[])[1].replace(/[, ]/g, '')
    const balance: BN = new BN(BigInt(JSON.parse(JSON.stringify(exposure)).free).toString())
    ownedAssetsMap.set(id, balance)
  })

  return Array.from(ownedAssetsMap).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as { [id: string]: BN })
}
