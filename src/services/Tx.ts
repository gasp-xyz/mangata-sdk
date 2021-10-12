/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

import recreateExtrinsicsOrder from '../utils/recreateExtrinsicsOrder'
import memoryDatabase from '../utils/MemoryDatabase'
import Query from './Query'

import { getTxNonce } from '../utils/nonce.tracker'
import { createPool as createPoolEntity } from '../entities/tx/createPool'
import { sellAsset as sellAssetEntity } from '../entities/tx/sellAsset'
import { buyAsset as buyAssetEntity } from '../entities/tx/buyAsset'
import { mintLiquidity as mintLiquidityEntity } from '../entities/tx/mintLiquidity'
import { burnLiquidity as burnLiquidityEntity } from '../entities/tx/burnLiquidity'
import { transferToken as transferTokenEntity } from '../entities/tx/transfer'
import { transferAllToken as transferAllTokenEntity } from '../entities/tx/transferAll'
import { createToken as createTokenEntity } from '../entities/tx/createToken'
import { mintToken as mintTokenEntity } from '../entities/tx/mintToken'

import { TxOptions } from '../types/TxOptions'
import { MangataGenericEvent } from '../types/MangataGenericEvent'
import { MangataEventData } from '../types/MangataEventData'

export const signTx = async (
  api: ApiPromise,
  tx: SubmittableExtrinsic<'promise'>,
  account: string | KeyringPair,
  txOptions?: TxOptions
): Promise<MangataGenericEvent[]> => {
  return new Promise<MangataGenericEvent[]>(async (resolve, reject) => {
    let output: MangataGenericEvent[] = []
    const extractedAccount = typeof account === 'string' ? account : account.address

    const nonce = await getTxNonce(api, extractedAccount, txOptions)
    // log.info('Nonce: ', nonce.toNumber())

    try {
      const unsub = await tx.signAndSend(
        account,
        { nonce, signer: txOptions && txOptions.signer ? txOptions.signer : undefined },
        async (result) => {
          txOptions && txOptions.statusCallback && txOptions.statusCallback(result)
          // log.info('Transaction status: ', result.status.type)
          if (result.status.isInBlock) {
            // log.info('Included at block hash: ', result.status.asInBlock.toHex())

            const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
              async (lastHeader) => {
                if (lastHeader.parentHash.toString() === result.status.asInBlock.toString()) {
                  unsubscribeNewHeads()
                  const previousBlock = await api.rpc.chain.getBlock(lastHeader.parentHash)
                  const previousBlockExtrinsics = previousBlock.block.extrinsics
                  const currentBlockEvents = await api.query.system.events.at(lastHeader.hash)
                  const blockNumber = lastHeader.toJSON().number
                  // log.info('Currently at block: ', blockNumber?.toString())

                  const headerJsonResponse = JSON.parse(lastHeader.toString())

                  const buffer: Buffer = Buffer.from(
                    headerJsonResponse['seed']['seed'].substring(2),
                    'hex'
                  )
                  const shuffledExtrinsics = recreateExtrinsicsOrder(
                    previousBlockExtrinsics,
                    Uint8Array.from(buffer)
                  )

                  const index = shuffledExtrinsics.findIndex((shuffledExtrinsic) => {
                    return (
                      shuffledExtrinsic?.isSigned &&
                      shuffledExtrinsic?.signer.toString() === extractedAccount &&
                      shuffledExtrinsic?.nonce.toString() === nonce.toString()
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

                      // log.info('Event Section: ', event.section)
                      // log.info('Event Method: ', event.method)
                      // log.info('Event Phase: ', JSON.stringify(phase, null, 2))
                      // log.info('Event Metadata: ', event.meta.documentation.toString())
                      // log.info(`Event Data:`, JSON.stringify(eventData, null, 2))

                      return {
                        event,
                        phase,
                        section: event.section,
                        method: event.method,
                        metaDocumentation: event.meta.documentation.toString(),
                        eventData,
                      } as MangataGenericEvent
                    })
                  output = output.concat(reqEvents)
                }
              }
            )
          } else if (result.status.isFinalized) {
            // log.info('Finalized block hash: ', result.status.asFinalized.toHex())
            resolve(output)
          } else if (result.isError) {
            // log.error(`Transaction error`)
            reject('Transaction error')
            const currentNonce: BN = await Query.getNonce(api, extractedAccount)
            memoryDatabase.setNonce(extractedAccount, currentNonce)
          } else if (result.isCompleted) {
            unsub()
          }
        }
      )
    } catch (error: any) {
      const currentNonce: BN = await Query.getNonce(api, extractedAccount)
      memoryDatabase.setNonce(extractedAccount, currentNonce)
      reject({
        data: error.message || error.description || error.data?.toString() || error.toString(),
      })
    }
  })
}

class Tx {
  static async createPool(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      createPoolEntity(api, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount),
      account,
      txOptions
    )
  }

  static async sellAsset(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      sellAssetEntity(api, soldTokenId, boughtTokenId, amount, minAmountOut),
      account,
      txOptions
    )
  }

  static async buyAsset(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      buyAssetEntity(api, soldTokenId, boughtTokenId, amount, maxAmountIn),
      account,
      txOptions
    )
  }

  static async mintLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN = new BN(Number.MAX_SAFE_INTEGER),
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      mintLiquidityEntity(
        api,
        firstTokenId,
        secondTokenId,
        firstTokenAmount,
        expectedSecondTokenAmount
      ),
      account,
      txOptions
    )
  }

  static async burnLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      burnLiquidityEntity(api, firstTokenId, secondTokenId, liquidityTokenAmount),
      account,
      txOptions
    )
  }

  static async transferToken(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(api, transferTokenEntity(api, address, tokenId, amount), account, txOptions)
  }

  static async transferAllToken(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(api, transferAllTokenEntity(api, address, tokenId), account, txOptions)
  }

  static async createToken(
    api: ApiPromise,
    address: string,
    sudoAccount: string | KeyringPair,
    tokenValu: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(api, createTokenEntity(api, address, tokenValu), sudoAccount, txOptions)
  }

  static async mintAsset(
    api: ApiPromise,
    sudoAccount: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(api, mintTokenEntity(api, address, tokenId, amount), sudoAccount, txOptions)
  }
}

export default Tx
