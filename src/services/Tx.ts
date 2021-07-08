/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
import memoryDatabase from '../utils/MemoryDatabase'
import { Query } from './Query'

type Itx = {
  createPool(
    api: ApiPromise,
    address: string,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN
  ): Promise<void>
}

const signTx = async (tx: SubmittableExtrinsic<'promise'>, address: string, onChainNonce?: BN) => {
  let nonce: BN
  if (onChainNonce && !memoryDatabase.hasAddressNonce(address)) {
    nonce = onChainNonce
  } else {
    nonce = memoryDatabase.getNonce(address)
  }

  if (onChainNonce && onChainNonce.gt(nonce)) {
    nonce = onChainNonce
  }

  const nextNonce: BN = nonce.addn(1)
  memoryDatabase.setNonce(address, nextNonce)

  await tx.signAndSend(address, { nonce }, ({ status, isError }) => {
    console.log('Transaction status:', status.type)
    if (status.isInBlock) {
      console.log('Included at block hash', status.asInBlock.toHex())
    } else if (status.isFinalized) {
      console.log('Finalized block hash', status.asFinalized.toHex())
    } else if (isError) {
      console.log('Transaction error')
      memoryDatabase.setNonce(address, nextNonce)
    }
  })
}

const createPool = async (
  api: ApiPromise,
  address: string,
  firstAssetId: string,
  firstAssetAmount: BN,
  secondAssetId: string,
  secondAssetAmount: BN
): Promise<void> => {
  signTx(
    api.tx.xyk.createPool(firstAssetId, firstAssetAmount, secondAssetId, secondAssetAmount),
    address,
    await Query.getNonce(api, address)
  )
}

export const TX: Itx = {
  createPool,
}
