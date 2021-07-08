import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'
import BN from 'bn.js'

type Iquery = {
  getNonce(api: ApiPromise, address: string): Promise<BN>
}

const getNonce = async (api: ApiPromise, address: string): Promise<BN> => {
  const accountInfo: AccountInfo = await api.query.system.account(address)
  return accountInfo.nonce.toBn()
}

export const Query: Iquery = {
  getNonce,
}
