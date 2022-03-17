/* eslint-disable no-console */
import { KeyringPair } from '@polkadot/keyring/types'
import { BN } from '@polkadot/util'

import { Mangata } from '../src/Mangata'
import ExtrinsicResult from '../src/enums/ExtrinsicResult'
import { MangataGenericEvent } from '../src/types/MangataGenericEvent'

export const addAccountCurrencies = async (
  mangataInstance: Mangata,
  user: KeyringPair,
  sudo: KeyringPair,
  currencyValues: BN[] = [new BN(250000), new BN(250001)]
): Promise<BN[]> => {
  const currencies: BN[] = []
  for (let currency = 0; currency < currencyValues.length; currency++) {
    await mangataInstance.waitForNewBlock()
    const nonce = await mangataInstance.getNonce(sudo.address)
    await mangataInstance
      .createToken(user.address, sudo, currencyValues[currency], {
        nonce,
        extrinsicStatus: (result) => {
          const eventResult = getEventResultFromTxWait(result, ['tokens', 'Issued', user.address])

          const currencyId = new BN(eventResult.data[0]['data'])
          currencies.push(currencyId)
        },
      })
      .then((result) => {
        const eventResult = getEventResultFromTxWait(result, ['tokens', 'Issued', user.address])
        const currencyId = new BN(eventResult.data[0]['data'])
        currencies.push(currencyId)
      })
  }
  await mangataInstance.waitForNewBlock()
  return currencies
}

export const getEventResultFromTxWait = (
  events: MangataGenericEvent[],
  searchTerm: string[] = []
): { state: ExtrinsicResult; data: string | number | any } => {
  const extrinsicResultMethods = ['ExtrinsicSuccess', 'ExtrinsicFailed', 'ExtrinsicUndefined']
  let extrinsicResult
  if (searchTerm.length > 0) {
    extrinsicResult = events.find((e) => {
      return (
        e.method !== null &&
        searchTerm.every((filterTerm) =>
          (JSON.stringify(e.event.toHuman()) + JSON.stringify(e.event.toHuman().data)).includes(
            filterTerm
          )
        )
      )
    })
  } else {
    extrinsicResult = events.find(
      (e) => e.method !== null && extrinsicResultMethods.includes(e.method)
    )
  }

  if (extrinsicResult) {
    switch (extrinsicResult.method) {
      case extrinsicResultMethods[1]:
        return { state: ExtrinsicResult.ExtrinsicFailed, data: 'Extrinsic Failed' }

      case extrinsicResultMethods[2]:
        return {
          state: ExtrinsicResult.ExtrinsicUndefined,
          data: extrinsicResult.eventData,
        }

      default:
        return { state: ExtrinsicResult.ExtrinsicSuccess, data: extrinsicResult.eventData }
    }
  }
  return { state: -1, data: 'ERROR: NO TX FOUND' }
}

export const addMGAToken = async (
  mangataInstance: Mangata,
  sudoUser: KeyringPair,
  user: KeyringPair,
  freeAmount: BN = new BN(10).pow(new BN(18))
): Promise<void> => {
  const sudoNonce = await mangataInstance.getNonce(sudoUser.address)
  await mangataInstance.waitForNewBlock()
  await mangataInstance.mintAsset(sudoUser, '0', user.address, new BN(freeAmount), {
    nonce: sudoNonce,
  })
}
