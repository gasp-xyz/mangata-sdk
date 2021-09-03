/* eslint-disable no-console */
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { KeypairType } from '@polkadot/util-crypto/types'
import { GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import type { DefinitionRpc, DefinitionRpcSub, RegistryTypes, AnyJson } from '@polkadot/types/types'
import { ApiOptions } from '@polkadot/api/types'
import BN from 'bn.js'
import { v4 as uuid } from 'uuid'

import { options } from './utils/options'
import rpcOptions from './utils/mangata-rpc'
import typesOptions from './utils/mangata-types'
import { ExtrinsicResult } from './services/types'
import { Mangata } from './Mangata'

export class MangataHelpers {
  public static getApiOptions(provider: WsProvider): ApiOptions {
    return options({ provider })
  }

  public static getMangataRpc(): Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>> {
    return rpcOptions
  }

  public static getMangataTypes(): RegistryTypes {
    return typesOptions
  }

  public static async waitNewBlock(api: ApiPromise): Promise<boolean> {
    let count = 0
    return new Promise(async (resolve) => {
      const unsubscribe = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        console.log(`Last block #${lastHeader.number} has hash ${lastHeader.hash}`)
        if (++count === 2) {
          unsubscribe()
          resolve(true)
        }
      })
    })
  }

  public static createKeyring(type: KeypairType): Keyring {
    return new Keyring({ type })
  }

  public static createKeyPairFromNameAndStoreAccountToKeyring(keyring: Keyring, name: string = '') {
    const userName: string = name ? name : '//testUser_' + uuid()
    const account = keyring.createFromUri(userName)
    keyring.addPair(account)
    return account
  }

  public static async addAccountCurrencies(
    mangataInstance: Mangata,
    user: KeyringPair,
    sudo: KeyringPair,
    currencyValues: BN[] = [new BN(250000), new BN(250001)]
  ): Promise<BN[]> {
    const currencies: BN[] = []
    for (let currency = 0; currency < currencyValues.length; currency++) {
      await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
      const nonce = await mangataInstance.getNonce(sudo.address)
      const result = await mangataInstance.createToken(
        user.address,
        sudo,
        currencyValues[currency],
        { nonce }
      )
      const eventResult = MangataHelpers.getEventResultFromTxWait(result, [
        'tokens',
        'Issued',
        user.address,
      ])

      const currencyId = new BN(eventResult.data[0])
      currencies.push(currencyId)
    }
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    return currencies
  }

  public static getEventResultFromTxWait(
    relatedEvents: GenericEvent[],
    searchTerm: string[] = []
  ): { state: ExtrinsicResult; data: string | number | any } {
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
          return { state: ExtrinsicResult.ExtrinsicFailed, data: parseInt(errorNumber) }

        case extrinsicResultMethods[2]:
          return { state: ExtrinsicResult.ExtrinsicUndefined, data: eventResult.data }

        default:
          return { state: ExtrinsicResult.ExtrinsicSuccess, data: eventResult.data }
      }
    }
    return { state: -1, data: 'ERROR: NO TX FOUND' }
  }

  public static async addMGAToken(
    mangataInstance: Mangata,
    sudoUser: KeyringPair,
    user: KeyringPair,
    freeAmount: BN = new BN(10).pow(new BN(11))
  ): Promise<GenericEvent[]> {
    const sudoNonce = await mangataInstance.getNonce(sudoUser.address)
    await MangataHelpers.waitNewBlock(await mangataInstance.getApi())
    return await mangataInstance.mintAsset(sudoUser, new BN(0), user.address, new BN(freeAmount), {
      nonce: sudoNonce,
    })
  }
}
