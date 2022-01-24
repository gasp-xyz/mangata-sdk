import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export const accountEntriesMap = async (api: ApiPromise, address: string) => {
  const ownedAssetsResponse = await api.query.tokens.accounts.entries(address)

  return ownedAssetsResponse.reduce((acc, [key, value]) => {
    const id = (key.toHuman() as string[])[1].replace(/[, ]/g, '')
    const balance: BN = new BN(BigInt(JSON.parse(JSON.stringify(value)).free).toString())
    acc[id] = balance
    return acc
  }, {} as { [id: string]: BN })
}
