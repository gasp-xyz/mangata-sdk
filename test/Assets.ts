/* eslint-disable no-console */
import xoshiro from 'xoshiro'
import { GenericExtrinsic, GenericEvent } from '@polkadot/types'
import { AnyJson } from '@polkadot/types/types'
import BN from 'bn.js'

import { User } from './User'
import { Mangata } from '../src'

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
    const result = await mangata.createToken(
      user.keyRingPair.address,
      sudo.keyRingPair,
      currencyValues[currency],
      { nonce }
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
