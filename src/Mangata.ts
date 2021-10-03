/* eslint-disable no-console */
import { ApiPromise, WsProvider } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { AccountData } from '@polkadot/types/interfaces/balances'
import BN from 'bn.js'

import Rpc from './services/Rpc'
import TX from './services/Tx'
import Query from './services/Query'

import { options } from './utils/options'
import { log } from './utils/logger'
import { TokensId } from './types/TokensId'
import { Reserve } from './types/Reserve'
import { Amount } from './types/Amount'
import { MangataAccount } from './types/MangataAccount'
import { Pool } from './types/Pool'
import { TokenId } from './types/TokenId'
import { MangataGenericEvent } from './types/MangataGenericEvent'
import { TxOptions } from './types/TxOptions'
import { Address } from './types/Address'

/**
 * @class Mangata
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
  private async connect(): Promise<ApiPromise> {
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
    log.info(`Retrieving chain ... `)
    const api = await this.connect()
    return Rpc.getChain(api)
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<string> {
    log.info(`Retrieving node name ...`)
    const api = await this.connect()
    return Rpc.getNodeName(api)
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<string> {
    log.info(`Retrieving node version ...`)
    const api = await this.connect()
    return Rpc.getNodeVersion(api)
  }

  /**
   * Retrieve the current nonce
   */

  public async getNonce(address: Address): Promise<BN> {
    log.info(`Retrieving nonce for the address: ${address}`)
    const api = await this.connect()
    return Query.getNonce(api, address)
  }

  /**
   * Disconnect
   */

  public async disconnect(): Promise<void> {
    log.info(`Disconnecting ...`)
    const api = await this.connect()
    api.disconnect()
  }

  /**
   * Create a pool
   */

  public async createPool(
    account: MangataAccount,
    firstTokenId: TokenId,
    firstTokenAmount: Amount,
    secondTokenId: TokenId,
    secondTokenAmount: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    log.info(`Creating pool ...`)
    const api = await this.connect()
    const pool: Pool = {
      firstTokenId: firstTokenId,
      firstTokenAmount: firstTokenAmount,
      secondTokenId: secondTokenId,
      secondTokenAmount: secondTokenAmount,
    }
    return await TX.createPool(api, account, pool, txOptions)
  }

  /**
   * Sell asset
   */
  public async sellAsset(
    account: MangataAccount,
    soldAssetId: TokenId,
    boughtAssetId: TokenId,
    amount: Amount,
    minAmountOut: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    log.info('Selling asset ...')
    const api = await this.connect()
    return await TX.sellAsset(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      amount,
      minAmountOut,
      txOptions
    )
  }

  /**
   * Extrinsic to add liquidity to pool, while specifying first asset id and second asset
   * id and first asset amount. Second asset amount is calculated in block, but cannot
   * exceed expected second asset amount
   */
  public async mintLiquidity(
    account: MangataAccount,
    firstTokenId: TokenId,
    secondTokenId: TokenId,
    firstTokenAmount: Amount,
    expectedSecondTokenAmount: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    log.info(`Adding liquidity to pool ...`)
    const api = await this.connect()
    const tokens: TokensId = {
      first: firstTokenId,
      second: secondTokenId,
    }
    return await TX.mintLiquidity(
      api,
      account,
      tokens,
      firstTokenAmount,
      expectedSecondTokenAmount,
      txOptions
    )
  }

  /**
   * Extrinsic to remove liquidity from liquidity pool, specifying first asset id and
   * second asset id of a pool and liquidity asset amount you wish to burn
   */
  public async burnLiquidity(
    account: MangataAccount,
    firstTokenId: TokenId,
    secondTokenId: TokenId,
    liquidityTokenAmount: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    log.info(`Removing liquidity from liquidity pool ...`)
    const api = await this.connect()
    const tokens: TokensId = {
      first: firstTokenId,
      second: secondTokenId,
    }
    return await TX.burnLiquidity(api, account, tokens, liquidityTokenAmount, txOptions)
  }

  /**
   * Extrinsic to buy/swap bought asset id in bought asset amount for sold asset id, while
   * specifying max amount in: maximal amount you are willing to pay in sold asset id to
   * purchase bouth asset id in bought asset amount
   */
  public async buyAsset(
    account: MangataAccount,
    soldAssetId: TokenId,
    boughtAssetId: TokenId,
    boughtAssetAmount: Amount,
    maxAmountIn: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    log.info('Buying asset ...')
    const api = await this.connect()
    return await TX.buyAsset(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      boughtAssetAmount,
      maxAmountIn,
      txOptions
    )
  }

  /**
   * Returns sell amount you need to pay in sold token id for bought token id in buy
   * amount, while specifying input reserve – reserve of sold token id, and output reserve
   * – reserve of bought token id
   */
  public async calculateBuyPrice(
    inputReserve: Amount,
    outputReserve: Amount,
    buyAmount: Amount
  ): Promise<BN> {
    log.info(`Calculating buy price ...`)
    const api = await this.connect()
    const reserve: Reserve = {
      input: inputReserve,
      output: outputReserve,
    }
    return await Rpc.calculateBuyPrice(api, reserve, buyAmount)
  }

  /**
   * Returns bought asset amount returned by selling sold token id for bought token id in
   * sell amount, while specifying input reserve – reserve of sold token id, and output
   * reserve – reserve of bought token id
   */
  public async calculateSellPrice(
    inputReserve: Amount,
    outputReserve: Amount,
    sellAmount: Amount
  ): Promise<BN> {
    log.info(`Calculating sell price ...`)
    const api = await this.connect()
    const reserve: Reserve = {
      input: inputReserve,
      output: outputReserve,
    }
    return await Rpc.calculateSellPrice(api, reserve, sellAmount)
  }

  /**
   * Create Token
   */
  public async createToken(
    targetAddress: Address,
    sudoAccount: MangataAccount,
    currencyValue: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.connect()
    return await TX.createToken(api, targetAddress, sudoAccount, currencyValue, txOptions)
  }

  /**
   * Mint Asset
   */
  public async mintAsset(
    sudoAccount: MangataAccount,
    tokenId: TokenId,
    address: Address,
    amount: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.connect()
    return await TX.mintAsset(api, sudoAccount, tokenId, address, amount, txOptions)
  }

  /**
   * Returns amounts of first asset id and second asset id, while specifying first, second
   * asset id liquidity asset amount of pool to burn
   */
  public async getBurnAmount(
    firstTokenId: TokenId,
    secondTokenId: TokenId,
    liquidityAssetAmount: BN
  ): Promise<any> {
    const api = await this.connect()
    const tokens: TokensId = {
      first: firstTokenId,
      second: secondTokenId,
    }
    return await Rpc.getBurnAmount(api, tokens, liquidityAssetAmount)
  }

  /**
   * Returns bought asset amount returned by selling sold token id for bought token id in
   * sell_amount
   */

  public async calculateSellPriceId(
    soldTokenId: TokenId,
    boughtTokenId: TokenId,
    sellAmount: Amount
  ): Promise<BN> {
    const api = await this.connect()
    const tokens: TokensId = {
      first: soldTokenId,
      second: boughtTokenId,
    }
    return await Rpc.calculateSellPriceId(api, tokens, sellAmount)
  }

  /**
   * Returns sell amount you need to pay in sold token id for bought token id in buy amount
   */

  public async calculateBuyPriceId(
    soldTokenId: TokenId,
    boughtTokenId: TokenId,
    buyAmount: Amount
  ): Promise<BN> {
    const api = await this.connect()
    const tokens: TokensId = {
      first: soldTokenId,
      second: boughtTokenId,
    }
    return await Rpc.calculateBuyPriceId(api, tokens, buyAmount)
  }

  /**
   * Get amount of token id in pool
   */
  public async getAmountOfTokenIdInPool(
    firstTokenId: TokenId,
    secondTokenId: TokenId
  ): Promise<BN> {
    const api = await this.connect()
    const tokens: TokensId = {
      first: firstTokenId,
      second: secondTokenId,
    }
    return await Query.getAmountOfTokenIdInPool(api, tokens)
  }

  /**
   * Returns liquidity asset id while specifying first and second TokenId returns same liquidity asset id when specifying other way
   * around – second and first TokenId
   */
  public async getLiquidityAssetId(firstTokenId: TokenId, secondTokenId: TokenId): Promise<BN> {
    const api = await this.connect()
    const tokens: TokensId = {
      first: firstTokenId,
      second: secondTokenId,
    }
    return await Query.getLiquidityAssetId(api, tokens)
  }

  /**
   * Returns pool corresponding to specified liquidity asset ID in from of first and second TokenId pair
   */
  public async getLiquidityPool(liquidityAssetId: TokenId): Promise<BN[]> {
    const api = await this.connect()
    return await Query.getLiquidityPool(api, liquidityAssetId)
  }

  /**
   * Returns amount of currency ID in Treasury
   */
  public async getTreasury(tokenId: TokenId): Promise<AccountData> {
    const api = await this.connect()
    return await Query.getTreasury(api, tokenId)
  }

  /**
   * Returns amount of currency ID in Treasury Burn
   */
  public async getTreasuryBurn(tokenId: TokenId): Promise<AccountData> {
    const api = await this.connect()
    return await Query.getTreasuryBurn(api, tokenId)
  }

  /**
   * Extrinsic that transfers TokenId in value amount from origin to destination
   */

  public async transferToken(
    account: MangataAccount,
    tokenId: TokenId,
    address: Address,
    amount: Amount,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.connect()
    return await TX.transferToken(api, account, tokenId, address, amount, txOptions)
  }

  /**
   * Extrinsic that transfers all token_id from origin to destination
   */

  public async transferTokenAll(
    account: MangataAccount,
    tokenId: TokenId,
    address: Address,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.connect()
    return await TX.transferAllToken(api, account, tokenId, address, txOptions)
  }

  /**
   * Returns total issuance of CurrencyId
   */

  public async getTotalIssuance(tokenId: TokenId): Promise<BN> {
    const api = await this.connect()
    return await Query.getTotalIssuance(api, tokenId)
  }

  /**
   * Returns vec of locked tokenId of an specified account Id Address and tokenId
   */
  public async getLock(address: Address, tokenId: TokenId) {
    const api = await this.connect()
    return await Query.getLock(api, address, tokenId)
  }

  /**
   * Returns Asset balance for address
   */
  public async getTokenBalance(tokenId: TokenId, address: Address): Promise<BN> {
    const api = await this.connect()
    return await Query.getTokenBalance(api, address, tokenId)
  }

  /**
   * Returns next CurencyId, CurrencyId that will be used for next created token
   */
  public async getNextTokenId(): Promise<BN> {
    const api = await this.connect()
    return await Query.getNextTokenId(api)
  }
}
