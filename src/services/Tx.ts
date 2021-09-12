/* eslint-disable no-console */
import { ApiPromise } from '@polkadot/api'
import { GenericExtrinsic, GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import BN from 'bn.js'
import xoshiro from 'xoshiro'
import memoryDatabase from '../utils/MemoryDatabase'
import { Query } from './Query'
import { Itx, txOptions } from './types'

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
  keyringPair: KeyringPair,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return new Promise<GenericEvent[]>(async (resolve) => {
    let result: GenericEvent[] = []
    let nonce: BN
    if (txOptions && txOptions.nonce) {
      nonce = txOptions.nonce
    } else {
      const onChainNonce = await Query.getNonce(api, keyringPair.address)
      if (memoryDatabase.hasAddressNonce(keyringPair.address)) {
        nonce = memoryDatabase.getNonce(keyringPair.address)
      } else {
        nonce = onChainNonce
      }

      if (onChainNonce && onChainNonce.gt(nonce)) {
        nonce = onChainNonce
      }
    }

    const nextNonce: BN = nonce.addn(1)
    memoryDatabase.setNonce(keyringPair.address, nextNonce)
    const unsub = await tx.signAndSend(
      keyringPair,
      { nonce, signer: txOptions && txOptions.signer ? txOptions.signer : undefined },
      async ({ status, isError }) => {
        console.log('Transaction status:', status.type)
        if (status.isInBlock) {
          console.log('Included at block hash', status.asInBlock.toHex())
          const unsub_new_heads = await api.derive.chain.subscribeNewHeads(async (lastHeader) => {
            if (lastHeader.parentHash.toString() === status.asInBlock.toString()) {
              unsub_new_heads()
              const prev_block_extrinsics = (await api.rpc.chain.getBlock(lastHeader.parentHash))
                .block.extrinsics
              const curr_block_extrinsics = (await api.rpc.chain.getBlock(lastHeader.hash)).block
                .extrinsics
              const curr_block_events = await api.query.system.events.at(lastHeader.hash)

              const extrinsic_with_seed = curr_block_extrinsics.find((e) => {
                return e.method.method === 'set' && e.method.section === 'random'
              })
              if (!extrinsic_with_seed) {
                return
              }

              const json_response = JSON.parse(extrinsic_with_seed.method.args[0].toString())
              const seed_bytes = Uint8Array.from(
                Buffer.from(json_response['seed'].substring(2), 'hex')
              )
              const shuffled_extrinsics = recreateExtrinsicsOrder(prev_block_extrinsics, seed_bytes)

              // filter extrinsic triggered by current request
              const index = shuffled_extrinsics.findIndex((e) => {
                return (
                  e.isSigned &&
                  e.signer.toString() === keyringPair.address &&
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
          console.log('Finalized block hash', status.asFinalized.toHex())
          unsub()
          resolve(result)
        } else if (isError) {
          console.log('Transaction error')
          const currentNonce: BN = await Query.getNonce(api, keyringPair.address)
          memoryDatabase.setNonce(keyringPair.address, currentNonce)
        }
      }
    )
  })
}

const createToken = async (
  api: ApiPromise,
  targetAddress: string,
  sudoKeyringPair: KeyringPair,
  currencyValue: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.sudo.sudo(api.tx.tokens.create(targetAddress, currencyValue)),
    sudoKeyringPair,
    txOptions
  )
}

const createPool = async (
  api: ApiPromise,
  keyRingPair: KeyringPair,
  firstAssetId: string,
  firstAssetAmount: BN,
  secondAssetId: string,
  secondAssetAmount: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.createPool(firstAssetId, firstAssetAmount, secondAssetId, secondAssetAmount),
    keyRingPair,
    txOptions
  )
}

const sellAsset = async (
  api: ApiPromise,
  keyRingPair: KeyringPair,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  minAmountOut: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.sellAsset(soldAssetId, boughtAssetId, amount, minAmountOut),
    keyRingPair,
    txOptions
  )
}

const buyAsset = async (
  api: ApiPromise,
  keyRingPair: KeyringPair,
  soldAssetId: string,
  boughtAssetId: string,
  amount: BN,
  maxAmountIn: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.buyAsset(soldAssetId, boughtAssetId, amount, maxAmountIn),
    keyRingPair,
    txOptions
  )
}

const mintLiquidity = async (
  api: ApiPromise,
  keyRingPair: KeyringPair,
  firstAssetId: string,
  secondAssetId: string,
  firstAssetAmount: BN,
  expectedSecondAssetAmount: BN = new BN(Number.MAX_SAFE_INTEGER),
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.mintLiquidity(
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount
    ),
    keyRingPair,
    txOptions
  )
}

const burnLiquidity = async (
  api: ApiPromise,
  keyRingPair: KeyringPair,
  firstAssetId: string,
  secondAssetId: string,
  liquidityAssetAmount: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.xyk.burnLiquidity(firstAssetId, secondAssetId, liquidityAssetAmount),
    keyRingPair,
    txOptions
  )
}

const mintAsset = async (
  api: ApiPromise,
  sudo: KeyringPair,
  assetId: BN,
  targetAddress: string,
  amount: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.sudo.sudo(api.tx.tokens.mint(assetId, targetAddress, amount)),
    sudo,
    txOptions
  )
}

const transferToken = async (
  api: ApiPromise,
  account: KeyringPair,
  tokenId: BN,
  targetAddress: string,
  amount: BN,
  txOptions?: txOptions
): Promise<GenericEvent[]> => {
  return await signTx(
    api,
    api.tx.tokens.transfer(targetAddress, tokenId, amount),
    account,
    txOptions
  )
}

const transferAllToken = async (
  api: ApiPromise,
  account: KeyringPair,
  tokenId: BN,
  targetAddress: string,
  txOptions?: txOptions
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
