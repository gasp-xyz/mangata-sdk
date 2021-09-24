/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { GenericExtrinsic } from '@polkadot/types'
import { Codec } from '@polkadot/types/types'
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
  MangataEventData,
  MangataGenericEvent,
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

const recreateExtrinsicsOrder = (extrinsics: GenericExtrinsic[], seedBytes: Uint8Array) => {
  const slots = extrinsics.map((ev) => {
    if (ev.isSigned) {
      return ev.signer.toString()
    } else {
      return 'None'
    }
  })

  fisher_yates_shuffle(slots, seedBytes)

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
): Promise<MangataGenericEvent[]> => {
  return new Promise<MangataGenericEvent[]>(async (resolve, reject) => {
    const extractedAccount = typeof account === 'string' ? account : account.address
    let result: MangataGenericEvent[] = []
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
    log.info('Nonce: ', nonce)
    try {
      const unsub = await tx.signAndSend(
        account,
        { nonce, signer: txOptions && txOptions.signer ? txOptions.signer : undefined },
        async ({ status, isError }) => {
          log.info('Transaction status: ', status.type)
          if (status.isInBlock) {
            log.info('Included at block hash: ', status.asInBlock.toHex())

            const unsub_new_heads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
              if (lastHeader.parentHash.toString() === status.asInBlock.toString()) {
                unsub_new_heads()
                const previousBlock = await api.rpc.chain.getBlock(lastHeader.parentHash)
                const previousBlockExtrinsics = previousBlock.block.extrinsics
                const currentBlockEvents = await api.query.system.events.at(lastHeader.hash)
                const blockNumber = lastHeader.toJSON().number
                log.info('Currently at block: ', blockNumber)

                const headerJsonResponse = JSON.parse(lastHeader.toString())

                const buffer: Buffer = Buffer.from(
                  headerJsonResponse['seed']['seed'].substring(2),
                  'hex'
                )
                const seedBytes = Uint8Array.from(buffer)
                const shuffledExtrinsics = recreateExtrinsicsOrder(
                  previousBlockExtrinsics,
                  seedBytes
                )

                const index = shuffledExtrinsics.findIndex((shuffledExtrinsic) => {
                  return (
                    shuffledExtrinsic.isSigned &&
                    shuffledExtrinsic.signer.toString() === extractedAccount &&
                    shuffledExtrinsic.nonce.toString() === nonce.toString()
                  )
                })
                if (index < 0) {
                  return
                }

                const reqEvents: MangataGenericEvent[] = currentBlockEvents
                  .filter((currentBlockEvent) => {
                    return (
                      currentBlockEvent.phase.isApplyExtrinsic &&
                      currentBlockEvent.phase.asApplyExtrinsic.toNumber() === index
                    )
                  })
                  .map((eventRecord) => {
                    const { event, phase } = eventRecord
                    const types = event.typeDef
                    const eventData: MangataEventData[] = event.data.map((d, i) => {
                      return {
                        type: types[i].type,
                        data: d,
                      }
                    })

                    log.info('Event Section: ', event.section)
                    log.info('Event Method: ', event.method)
                    log.info('Event Phase: ', JSON.stringify(phase, null, 2))
                    log.info('Event Metadata: ', event.meta.documentation.toString())
                    log.info(`Event Data:`, JSON.stringify(eventData, null, 2))

                    return {
                      event,
                      phase,
                      section: event.section,
                      method: event.method,
                      metaDocumentation: event.meta.documentation.toString(),
                      eventData,
                    } as MangataGenericEvent
                  })
                result = result.concat(reqEvents)
              }
            })
          } else if (status.isFinalized) {
            log.info('Finalized block hash: ', status.asFinalized.toHex())
            unsub()
            resolve(result)
          } else if (isError) {
            unsub()
            log.error(`Transaction error`)
            const currentNonce: BN = await Query.getNonce(api, extractedAccount)
            memoryDatabase.setNonce(extractedAccount, currentNonce)
          }
        }
      )
    } catch (error) {
      reject({
        type: 'type',
        data: (error as Error).message || (error as Error).message || (error as Error).toString(),
      })
    }
  })
}

const createToken: CreateTokenType = async (
  api: ApiPromise,
  targetAddress: string,
  sudoAccount: KeyringPair | string,
  currencyValue: BN,
  txOptions?: TxOptions
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
): Promise<MangataGenericEvent[]> => {
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
