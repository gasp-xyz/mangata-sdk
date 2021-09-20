/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { GenericExtrinsic, GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
import xoshiro from 'xoshiro'

import memoryDatabase from '../utils/MemoryDatabase'
import { Query } from './Query'
import {
  BurnLiquidityType,
  BuyAssetType,
  CreatePoolType,
  CreateTokenType,
  Itx,
  MintAssetType,
  MintLiquidityType,
  SellAssetType,
  TransferAllTokenType,
  TransferTokenType,
  TxOptions,
} from '../types'
import { log } from '../utils/logger'

export const fisher_yates_shuffle = <K>(objects: K[], seed: Uint8Array) => {
  const prng = xoshiro.create('256+', seed)
  for (let i = objects.length - 1; i > 0; i--) {
    const j = prng.roll() % i
    const tmp = objects[i]
    objects[i] = objects[j]
    objects[j] = tmp
  }
}

const recreateExtrinsicsOrder = (extrinsics: GenericExtrinsic[], seed_bytes: Uint8Array) => {
  const slots = extrinsics.map((ev) => {
    if (ev.isSigned) {
      return ev.signer.toString()
    } else {
      return 'None'
    }
  })

  fisher_yates_shuffle(slots, seed_bytes)

  const map = new Map()

  for (const e of extrinsics) {
    let who = 'None'
    if (e.isSigned) {
      who = e.signer.toString()
    }

    if (map.has(who)) {
      map.get(who).push(e)
    } else {
      map.set(who, [e])
    }
  }

  const shuffled_extrinsics = slots.map((who) => {
    return map.get(who).shift()
  })
  return shuffled_extrinsics
}

export const signTx = async (
  api: ApiPromise,
  tx: SubmittableExtrinsic<'promise'>,
  account: KeyringPair | string,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return new Promise<GenericEvent[]>(async (resolve) => {
    const extractedAccount = typeof account === 'string' ? account : account.address
    let result: GenericEvent[] = []
    let nonce: BN
    if (txOptions && txOptions.nonce) {
      nonce = txOptions.nonce
    } else {
      const onChainNonce = await Query.getNonce(api, extractedAccount)
      if (memoryDatabase.hasAddressNonce(extractedAccount)) {
        nonce = memoryDatabase.getNonce(extractedAccount)
      } else {
        nonce = onChainNonce
      }

      if (onChainNonce && onChainNonce.gt(nonce)) {
        nonce = onChainNonce
      }
    }

    const nextNonce: BN = nonce.addn(1)
    memoryDatabase.setNonce(extractedAccount, nextNonce)
    log.info(`Nonce: ${nonce}`)
    const unsub = await tx.signAndSend(
      account,
      { nonce, signer: txOptions && txOptions.signer ? txOptions.signer : undefined },
      async ({ status, isError }) => {
        log.info(`Transaction status: ${status.type}`)
        if (status.isInBlock) {
          log.info(`Included at block hash: ${status.asInBlock.toHex()}`)
          const unsub_new_heads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
            if (lastHeader.parentHash.toString() === status.asInBlock.toString()) {
              unsub_new_heads()
              const prev_block_extrinsics = (await api.rpc.chain.getBlock(lastHeader.parentHash))
                .block.extrinsics
              const curr_block_events = await api.query.system.events.at(lastHeader.hash)

              const json_response = JSON.parse(lastHeader.toString())
              const seed_bytes = Uint8Array.from(
                Buffer.from(json_response['seed']['seed'].substring(2), 'hex')
              )
              const shuffled_extrinsics = recreateExtrinsicsOrder(prev_block_extrinsics, seed_bytes)

              // filter extrinsic triggered by current request
              const index = shuffled_extrinsics.findIndex((e) => {
                return (
                  e.isSigned &&
                  e.signer.toString() === extractedAccount &&
                  e.nonce.toString() === nonce.toString()
                )
              })
              if (index < 0) {
                return
              }

              const req_events = curr_block_events
                .filter((event) => {
                  return (
                    event.phase.isApplyExtrinsic &&
                    event.phase.asApplyExtrinsic.toNumber() === index
                  )
                })
                .map(({ event }) => {
                  return event
                })
              result = result.concat(req_events)
            }
          })
        } else if (status.isFinalized) {
          log.info(`Finalized block hash: ${status.asFinalized.toHex()}`)
          unsub()
          resolve(result)
        } else if (isError) {
          log.error(`Transaction error`)
          const currentNonce: BN = await Query.getNonce(api, extractedAccount)
          memoryDatabase.setNonce(extractedAccount, currentNonce)
        }
      }
    )
  })
}

const createToken: CreateTokenType = async (
  api: ApiPromise,
  targetAddress: string,
  sudoAccount: KeyringPair | string,
  currencyValue: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.sudo.sudo(api.tx.tokens.create(targetAddress, currencyValue)),
    sudoAccount,
    txOptions
  )
}

const createPool: CreatePoolType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  firstAssetId: string,
  firstAssetAmount: BN,
  secondAssetId: string,
  secondAssetAmount: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.createPool(firstAssetId, firstAssetAmount, secondAssetId, secondAssetAmount),
    account,
    txOptions
  )
}

const sellAsset: SellAssetType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  minAmountOut: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.sellAsset(soldAssetId, boughtAssetId, amount, minAmountOut),
    account,
    txOptions
  )
}

const buyAsset: BuyAssetType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  maxAmountIn: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.buyAsset(soldAssetId, boughtAssetId, amount, maxAmountIn),
    account,
    txOptions
  )
}

const mintLiquidity: MintLiquidityType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  firstAssetId: string,
  secondAssetId: string,
  firstAssetAmount: BN,
  expectedSecondAssetAmount: BN = new BN(Number.MAX_SAFE_INTEGER),
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.mintLiquidity(
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount
    ),
    account,
    txOptions
  )
}

const burnLiquidity: BurnLiquidityType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  firstAssetId: string,
  secondAssetId: string,
  liquidityAssetAmount: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.burnLiquidity(firstAssetId, secondAssetId, liquidityAssetAmount),
    account,
    txOptions
  )
}

const mintAsset: MintAssetType = async (
  api: ApiPromise,
  sudoAccount: KeyringPair | string,
  assetId: BN,
  targetAddress: string,
  amount: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.sudo.sudo(api.tx.tokens.mint(assetId, targetAddress, amount)),
    sudoAccount,
    txOptions
  )
}

const transferToken: TransferTokenType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  tokenId: BN,
  targetAddress: string,
  amount: BN,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.tokens.transfer(targetAddress, tokenId, amount),
    account,
    txOptions
  )
}

const transferAllToken: TransferAllTokenType = async (
  api: ApiPromise,
  account: KeyringPair | string,
  tokenId: BN,
  targetAddress: string,
  txOptions?: TxOptions
): Promise<GenericEvent[]> => {
  return await signTx(api, api.tx.tokens.transferAll(targetAddress, tokenId), account, txOptions)
}

export const TX: Itx = {
  createPool,
  sellAsset,
  buyAsset,
  mintLiquidity,
  burnLiquidity,
  createToken,
  mintAsset,
  transferToken,
  transferAllToken,
}
