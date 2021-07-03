import { ApiPromise } from '@polkadot/api'
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types'
import { bnToBn } from '@polkadot/util'
import { Query } from './Query'

type Itx = {
  createPool(
    api: ApiPromise,
    address: string,
    firstAssetId: string,
    firstAssetAmount: number,
    secondAssetId: string,
    secondAssetAmount: number
  ): Promise<void>
}

const signTx = async (
  tx: SubmittableExtrinsic<'promise'>,
  address: AddressOrPair,
  nonce: string
) => {
  await tx.signAndSend(address, { nonce: bnToBn(nonce) })
}

const createPool = async (
  api: ApiPromise,
  address: string,
  firstAssetId: string,
  firstAssetAmount: number,
  secondAssetId: string,
  secondAssetAmount: number
): Promise<void> => {
  signTx(
    api.tx.xyk.createPool(
      bnToBn(firstAssetId),
      bnToBn(firstAssetAmount),
      bnToBn(secondAssetId),
      bnToBn(secondAssetAmount)
    ),
    address,
    await Query.getCurrentNonce(api, address)
  )
}

export const TX: Itx = {
  createPool,
}
