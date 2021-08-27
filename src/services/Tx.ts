/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
import memoryDatabase from '../utils/MemoryDatabase'
import { Query } from './Query'
import { Itx, txOptions } from './types'

const signTx = async (
  api: ApiPromise,
  tx: SubmittableExtrinsic<'promise'>,
  address: string,
  txOptions?: txOptions
) => {
  let nonce: BN
  if (txOptions && txOptions.nonce) {
    nonce = txOptions.nonce
  } else {
    const onChainNonce = await Query.getNonce(api, address)
    if (!memoryDatabase.hasAddressNonce(address)) {
      nonce = onChainNonce
    } else {
      nonce = memoryDatabase.getNonce(address)
    }

    if (onChainNonce && onChainNonce.gt(nonce)) {
      nonce = onChainNonce
    }
  }

  const nextNonce: BN = nonce.addn(1)
  memoryDatabase.setNonce(address, nextNonce)

  await tx.signAndSend(address, { nonce }, async ({ status, isError }) => {
    console.log('Transaction status:', status.type)
    if (status.isInBlock) {
      console.log('Included at block hash', status.asInBlock.toHex())
    } else if (status.isFinalized) {
      console.log('Finalized block hash', status.asFinalized.toHex())
    } else if (isError) {
      console.log('Transaction error')
      const currentNonce: BN = await Query.getNonce(api, address)
      memoryDatabase.setNonce(address, currentNonce)
    }
  })
}

const createPool = async (
  api: ApiPromise,
  address: string,
  firstAssetId: string,
  firstAssetAmount: BN,
  secondAssetId: string,
  secondAssetAmount: BN,
  txOptions?: txOptions
): Promise<void> => {
  signTx(
    api,
    api.tx.xyk.createPool(firstAssetId, firstAssetAmount, secondAssetId, secondAssetAmount),
    address,
    txOptions
  )
}

const sellAsset = async (
  api: ApiPromise,
  address: string,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  minAmountOut: BN,
  txOptions?: txOptions
): Promise<void> => {
  signTx(
    api,
    api.tx.xyk.sellAsset(soldAssetId, boughtAssetId, amount, minAmountOut),
    address,
    txOptions
  )
}

const buyAsset = async (
  api: ApiPromise,
  address: string,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  maxAmountIn: BN,
  txOptions?: txOptions
): Promise<void> => {
  signTx(
    api,
    api.tx.xyk.buyAsset(soldAssetId, boughtAssetId, amount, maxAmountIn),
    address,
    txOptions
  )
}

const mintLiquidity = async (
  api: ApiPromise,
  address: string,
  firstAssetId: string,
  secondAssetId: string,
  firstAssetAmount: BN,
  expectedSecondAssetAmount: BN = new BN(Number.MAX_SAFE_INTEGER),
  txOptions?: txOptions
) => {
  signTx(
    api,
    api.tx.xyk.mintLiquidity(
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount
    ),
    address,
    txOptions
  )
}

const burnLiquidity = async (
  api: ApiPromise,
  address: string,
  firstAssetId: string,
  secondAssetId: string,
  liquidityAssetAmount: BN,
  txOptions?: txOptions
) => {
  signTx(
    api,
    api.tx.xyk.burnLiquidity(firstAssetId, secondAssetId, liquidityAssetAmount),
    address,
    txOptions
  )
}

export const TX: Itx = {
  createPool,
  sellAsset,
  buyAsset,
  mintLiquidity,
  burnLiquidity,
}
