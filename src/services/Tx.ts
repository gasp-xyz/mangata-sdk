import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
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

const signTx = async (tx: SubmittableExtrinsic<'promise'>, address: string, nonce: string) => {
  await tx.signAndSend(address, { nonce })
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
    await Query.getCurrentNonce(api, address)
  )
}

export const TX: Itx = {
  createPool,
}
