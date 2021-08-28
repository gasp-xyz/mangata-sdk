/* eslint-disable no-console */
import { User } from './User'
import { GenericExtrinsic, GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { AnyJson } from '@polkadot/types/types'
import BN from 'bn.js'
import { Mangata } from '../src'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import xoshiro from 'xoshiro'

const DEFAULT_TIME_OUT_MS = 42000

export const addUserCurrencies = async (
  mangata: Mangata,
  user: User,
  currencyValues: BN[] = [new BN(250000), new BN(250001)],
  sudo: User
): Promise<BN[]> => {
  const currencies: BN[] = []
  for (let currency = 0; currency < currencyValues.length; currency++) {
    await mangata.waitNewBlock()
    const nonce = await mangata.getNonce(sudo.keyRingPair.address)
    const api = await mangata.getApi()
    const result = await signAndWaitTx(
      mangata,
      api.tx.sudo.sudo(api.tx.tokens.create(user.keyRingPair.address, currencyValues[currency])),
      sudo.keyRingPair,
      nonce.toNumber()
    )
    const eventResult = getEventResultFromTxWait(result, [
      'tokens',
      'Issued',
      user.keyRingPair.address,
    ])

    const currencyId = new BN(eventResult.data[0])
    currencies.push(currencyId)
    user.addAsset(currencyId, new BN(currencyValues[currency]))
  }
  await mangata.waitNewBlock()
  return currencies
}

export const signAndWaitTx = async (
  mangata: Mangata,
  tx: SubmittableExtrinsic<'promise'>,
  who: any,
  nonce: number,
  timeout_ms: number = DEFAULT_TIME_OUT_MS
): Promise<GenericEvent[]> => {
  return new Promise<GenericEvent[]>(async (resolve, reject) => {
    const api = await mangata.getApi()
    let result: GenericEvent[] = []

    if (timeout_ms > 0) {
      setTimeout(() => {
        reject(
          `timeout in - signAndWaitTx - " + ${
            who.address
          } + " - " + ${nonce} + " - " + ${JSON.stringify(tx.toHuman())}`
        )
      }, timeout_ms)
    }

    const unsub = await tx.signAndSend(who, { nonce }, async ({ events = [], status }) => {
      if (status.isInBlock) {
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
                e.signer.toString() === who.address &&
                e.nonce.toString() === nonce.toString()
              )
            })
            if (index < 0) {
              return
            }

            const req_events = curr_block_events
              .filter((event) => {
                return (
                  event.phase.isApplyExtrinsic && event.phase.asApplyExtrinsic.toNumber() === index
                )
              })
              .map(({ phase, event }) => {
                return event
              })
            result = result.concat(req_events)
          }
        })
      } else if (status.isFinalized) {
        unsub()
        resolve(result)
      }
    })
  })
}

export const recreateExtrinsicsOrder = (extrinsics: GenericExtrinsic[], seed_bytes: Uint8Array) => {
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

export const fisher_yates_shuffle = <K>(objects: K[], seed: Uint8Array) => {
  const prng = xoshiro.create('256+', seed)
  for (let i = objects.length - 1; i > 0; i--) {
    const j = prng.roll() % i
    const tmp = objects[i]
    objects[i] = objects[j]
    objects[j] = tmp
  }
}

export const getEventResultFromTxWait = (
  relatedEvents: GenericEvent[],
  searchTerm: string[] = []
): EventResult => {
  const extrinsicResultMethods = ['ExtrinsicSuccess', 'ExtrinsicFailed', 'ExtrinsicUndefined']
  let extrinsicResult
  if (searchTerm.length > 0) {
    extrinsicResult = relatedEvents.find(
      (e) =>
        e.toHuman().method !== null &&
        searchTerm.every((filterTerm) =>
          (JSON.stringify(e.toHuman()) + JSON.stringify(e.toHuman().data)).includes(filterTerm)
        )
    )
  } else {
    extrinsicResult = relatedEvents.find(
      (e) =>
        e.toHuman().method !== null &&
        extrinsicResultMethods.includes(e.toHuman().method!.toString())
    )
  }

  if (extrinsicResult) {
    const eventResult = extrinsicResult.toHuman()
    switch (eventResult.method) {
      case extrinsicResultMethods[1]:
        const data = eventResult.data as AnyJson[]
        const error = JSON.stringify(data[0])
        const errorNumber = JSON.parse(error).Module.error
        return new EventResult(ExtrinsicResult.ExtrinsicFailed, parseInt(errorNumber))

      case extrinsicResultMethods[2]:
        return new EventResult(ExtrinsicResult.ExtrinsicUndefined, eventResult.data)

      default:
        return new EventResult(ExtrinsicResult.ExtrinsicSuccess, eventResult.data)
    }
  }
  return new EventResult(-1, 'ERROR: NO TX FOUND')
}

enum ExtrinsicResult {
  ExtrinsicSuccess,
  ExtrinsicFailed,
  ExtrinsicUndefined,
}

class EventResult {
  constructor(state: ExtrinsicResult = ExtrinsicResult.ExtrinsicUndefined, data: any) {
    this.state = state
    this.data = data
  }

  state: ExtrinsicResult
  data: String
}
