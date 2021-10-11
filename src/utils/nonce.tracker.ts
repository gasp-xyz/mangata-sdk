import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

import Query from '../services/Query'
import memoryDatabase from '../utils/MemoryDatabase'
import { TxOptions } from '../types/TxOptions'

export const getTxNonce = async (
  api: ApiPromise,
  address: string,
  txOptions?: TxOptions
): Promise<BN> => {
  let nonce: BN
  if (txOptions && txOptions.nonce) {
    nonce = txOptions.nonce
  } else {
    const onChainNonce = await Query.getNonce(api, address)
    if (memoryDatabase.hasAddressNonce(address)) {
      nonce = memoryDatabase.getNonce(address)
    } else {
      nonce = onChainNonce
    }

    if (onChainNonce && onChainNonce.gt(nonce)) {
      nonce = onChainNonce
    }
  }

  const nextNonce: BN = nonce.addn(1)
  memoryDatabase.setNonce(address, nextNonce)

  return nonce
}