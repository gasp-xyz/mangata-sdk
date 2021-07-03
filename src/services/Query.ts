import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'

type Iquery = {
  getCurrentNonce(api: ApiPromise, address: string): Promise<string>
}

const getCurrentNonce = async (api: ApiPromise, address: string): Promise<string> => {
  const accountInfo: AccountInfo = await api.query.system.account(address)
  return accountInfo.nonce.toString()
}

export const Query: Iquery = {
  getCurrentNonce,
}
