/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'

import recreateExtrinsicsOrder from '../utils/recreateExtrinsicsOrder'
import memoryDatabase from '../utils/MemoryDatabase'
import Query from './Query'
import { getTxNonce } from '../utils/nonce.tracker'

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

    try {
      const unsub = await tx.signAndSend(
        account,
        { nonce, signer: txOptions && txOptions.signer ? txOptions.signer : undefined },
        async (result) => {
          txOptions && txOptions.statusCallback && txOptions.statusCallback(result)
          const blockNumber = await api.query.system.number()
          if (result.status.isFinalized) {
            const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
              async (lastHeader) => {
                if (lastHeader.parentHash.toString() === result.status.asFinalized.toString()) {
                  unsubscribeNewHeads()
                  //const previousBlock = await api.rpc.chain.getBlock(lastHeader.parentHash)
                  //const previousBlockExtrinsics = previousBlock.block.extrinsics
                  const currentBlock = await api.rpc.chain.getBlock(lastHeader.hash)
                  const currentBlockExtrinsics = currentBlock.block.extrinsics
                  const currentBlockEvents = await api.query.system.events.at(lastHeader.hash)
                  const headerJsonResponse = JSON.parse(lastHeader.toString())

                  const buffer: Buffer = Buffer.from(
                    headerJsonResponse['seed']['seed'].substring(2),
                    'hex'
                  )
                  const countOfExtrinsicsFromThisBlock = headerJsonResponse['count']
                  const currentBlockInherents = currentBlockExtrinsics
                    .slice(0, countOfExtrinsicsFromThisBlock)
                    .filter((tx) => {
                      return !tx.isSigned
                    })
                  const previousBlockExtrinsics = currentBlockExtrinsics.slice(
                    countOfExtrinsicsFromThisBlock,
                    currentBlockExtrinsics.length
                  )
                  const bothBlocksExtrinsics = currentBlockInherents.concat(previousBlockExtrinsics)
                  const shuffledExtrinsics = recreateExtrinsicsOrder(
                    bothBlocksExtrinsics.map((tx) => {
                      const who = tx.isSigned ? tx.signer.toString() : '0000'
                      return [who, tx]
                    }),
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

                      return {
                        event,
                        phase,
                        section: event.section,
                        method: event.method,
                        metaDocumentation: event.meta.docs.toString(),
                        eventData,
                        error: getError(api, event.method, eventData),
                      } as MangataGenericEvent
                    })

                  output = output.concat(reqEvents)
                  resolve(output)
                  unsub()
                } else if (lastHeader.hash.toString() === result.status.asFinalized.toString()) {
                } else {
                  unsubscribeNewHeads()
                  reject()
                  unsub()
                }
              }
            )
          } else if (result.isError) {
            reject(`W[${process.env.JEST_WORKER_ID}]  - ${tx.hash} ` + 'Transaction error')
            const currentNonce: BN = await Query.getNonce(api, extractedAccount)
            memoryDatabase.setNonce(extractedAccount, currentNonce)
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

type TErrorData = {
  Module?: {
    index?: string
    error?: string
  }
}

const getError = (
  api: ApiPromise,
  method: string,
  eventData: MangataEventData[]
): {
  documentation: string[]
  name: string
} | null => {
  const failedEvent = method === 'ExtrinsicFailed'

  if (failedEvent) {
    const error = eventData.find((item) => item.type === 'DispatchError')
    const errorData = error?.data?.toHuman?.() as TErrorData | undefined
    const errorIdx = errorData?.Module?.error
    const moduleIdx = errorData?.Module?.index

    if (errorIdx && moduleIdx) {
      try {
        const decode = api.registry.findMetaError({
          error: new BN(errorIdx),
          index: new BN(moduleIdx),
        })
        return {
          documentation: decode.docs,
          name: decode.name,
        }
      } catch (error) {
        return {
          documentation: ['Unknown error'],
          name: 'UnknownError',
        }
      }
    } else {
      return {
        documentation: ['Unknown error'],
        name: 'UnknownError',
      }
    }
  }

  return null
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
      api.tx.xyk.createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount),
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
      api.tx.xyk.sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut),
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
      api.tx.xyk.buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn),
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
      api.tx.xyk.mintLiquidity(
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
      api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, liquidityTokenAmount),
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
    return await signTx(api, api.tx.tokens.transfer(address, tokenId, amount), account, txOptions)
  }

  static async transferAllToken(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(api, api.tx.tokens.transferAll(address, tokenId, true), account, txOptions)
  }

  static async createToken(
    api: ApiPromise,
    address: string,
    sudoAccount: string | KeyringPair,
    tokenValue: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.sudo.sudo(api.tx.tokens.create(address, tokenValue)),
      sudoAccount,
      txOptions
    )
  }

  static async mintAsset(
    api: ApiPromise,
    sudoAccount: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.sudo.sudo(api.tx.tokens.mint(tokenId, address, amount)),
      sudoAccount,
      txOptions
    )
  }

  static async bridgeERC20ToEthereum(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenAddress: string,
    ethereumAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.erc20.burn(tokenAddress, ethereumAddress, amount),
      account,
      txOptions
    )
  }

  static async bridgeEthToEthereum(
    api: ApiPromise,
    account: string | KeyringPair,
    ethereumAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ) {
    return await signTx(api, api.tx.eth.burn(ethereumAddress, amount), account, txOptions)
  }
}

export default Tx
