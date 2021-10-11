/* eslint-disable no-console */
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { KeypairType } from '@polkadot/util-crypto/types'
import { KeyringPair } from '@polkadot/keyring/types'
import type { DefinitionRpc, DefinitionRpcSub, RegistryTypes } from '@polkadot/types/types'
import { ApiOptions } from '@polkadot/api/types'
import { v4 as uuid } from 'uuid'

import { options } from './utils/options'
import rpcOptions from './utils/mangata-rpc'
import typesOptions from './utils/mangata-types'
import { Roarr as log } from 'roarr'

/**
 * @class MangataHelpers
 */
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
        log(`Last block #${lastHeader.number} has hash ${lastHeader.hash}`)
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

  public static createKeyPairFromNameAndStoreAccountToKeyring(
    keyring: Keyring,
    name: string = ''
  ): KeyringPair {
    const userName: string = name ? name : '//testUser_' + uuid()
    const account = keyring.createFromUri(userName)
    keyring.addPair(account)
    return account
  }
}
