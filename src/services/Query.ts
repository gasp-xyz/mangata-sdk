import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import memoryDatabase from '../utils/MemoryDatabase'

type Iquery = {
  getNonce(api: ApiPromise, address: string): Promise<BN>
}

const getNonce = async (api: ApiPromise, address: string): Promise<BN> => {
  const accountInfo: AccountInfo = await api.query.system.account(address)
  const onchainNonce: BN = accountInfo.nonce.toBn()

  let nonce: BN

  if (!memoryDatabase.hasAddressNonce(address)) {
    nonce = onchainNonce
  } else {
    nonce = memoryDatabase.getNonce(address)
  }

  if (onchainNonce.gt(nonce)) {
    nonce = onchainNonce
  }

  const nextNonce: BN = nonce.addn(1)
  memoryDatabase.setNonce(address, nextNonce)
  return nonce
}

export const Query: Iquery = {
  getNonce,
}
