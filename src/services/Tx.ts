import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
import { Query } from './Query'

type Itx = {
  createPool(
    api: ApiPromise,
    account: KeyringPair,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN
  ): Promise<void>
}

const signTx = async (tx: SubmittableExtrinsic<'promise'>, account: KeyringPair, nonce: string) => {
  await tx.signAndSend(account, { nonce })
}

const createPool = async (
  api: ApiPromise,
  account: KeyringPair,
  firstAssetId: string,
  firstAssetAmount: BN,
  secondAssetId: string,
  secondAssetAmount: BN
): Promise<void> => {
  signTx(
    api.tx.xyk.createPool(firstAssetId, firstAssetAmount, secondAssetId, secondAssetAmount),
    account,
    await Query.getCurrentNonce(api, account.address)
  )
}

export const TX: Itx = {
  createPool,
}
