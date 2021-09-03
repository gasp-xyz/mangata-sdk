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
import { RPC } from './services/Rpc'
import { TX } from './services/Tx'
import { Query } from './services/Query'
import { ExtrinsicResult, txOptions } from './services/types'

/**
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance. Design pattern Singleton Promise is used.
 */
export class Mangata {
  private static instance: Mangata
  private api: ApiPromise | null
  private uri: string

  /**
   * The Mangata's constructor is private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(uri: string) {
    this.api = null
    this.uri = uri
  }

  /**
   * Initialised via isReady & new with specific provider
   */
  private async connect() {
    if (!this.api) {
      const provider = new WsProvider(this.uri)
      this.api = await ApiPromise.create(options({ provider }))
    }

    return this.api
  }

  /**
   * The static method that controls the access to the Mangata instance.
   */
  public static getInstance(uri: string): Mangata {
    if (!Mangata.instance) {
      Mangata.instance = new Mangata(uri)
    }

    return Mangata.instance
  }

  /**
   * Retrieve the underlying API
   */
  public async getApi(): Promise<ApiPromise> {
    return await this.connect()
  }

  /**
   * Retrieve the chain name
   */

  public async getChain(): Promise<string> {
    const api = await this.connect()
    return RPC.getChain(api)
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<string> {
    const api = await this.connect()
    return RPC.getNodeName(api)
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<string> {
    const api = await this.connect()
    return RPC.getNodeVersion(api)
  }

  /**
   * Retrieve the current nonce
   */

  public async getNonce(address: string): Promise<BN> {
    const api = await this.connect()
    return Query.getNonce(api, address)
  }

  /**
   * Disconnect
   */

  public async disconnect(): Promise<void> {
    const api = await this.connect()
    api.disconnect()
  }

  /**
   * Create a pool
   */

  public async createPool(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.createPool(
      api,
      keyRingPair,
      firstAssetId,
      firstAssetAmount,
      secondAssetId,
      secondAssetAmount,
      txOptions
    )
  }

  /**
   * Sell asset
   */
  public async sellAsset(
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.sellAsset(
      api,
      keyRingPair,
      soldAssetId,
      boughtAssetId,
      amount,
      minAmountOut,
      txOptions
    )
  }

  /**
   * Mint liquidity
   */
  public async mintLiquidity(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.mintLiquidity(
      api,
      keyRingPair,
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount,
      txOptions
    )
  }

  /**
   * Burn liquidity
   */
  public async burnLiquidity(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.burnLiquidity(
      api,
      keyRingPair,
      firstAssetId,
      secondAssetId,
      liquidityAssetAmount,
      txOptions
    )
  }

  /**
   * Buy asset
   */
  public async buyAsset(
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.buyAsset(
      api,
      keyRingPair,
      soldAssetId,
      boughtAssetId,
      amount,
      maxAmountIn,
      txOptions
    )
  }

  /**
   * Calculate buy price
   */
  public async calculateBuyPrice(soldTokenId: BN, boughtTokenId: BN, buyAmount: BN) {
    const api = await this.connect()
    return await RPC.calculateBuyPrice(api, soldTokenId, boughtTokenId, buyAmount)
  }

  /**
   * Create Token
   */
  public async createToken(
    targetAddress: string,
    sudoKeyringPair: KeyringPair,
    currencyValue: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.createToken(api, targetAddress, sudoKeyringPair, currencyValue, txOptions)
  }

  /**
   * Mint Asset
   */
  public async mintAsset(
    sudo: KeyringPair,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.mintAsset(api, sudo, assetId, targetAddress, amount, txOptions)
  }
}

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
