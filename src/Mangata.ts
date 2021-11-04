/* eslint-disable no-console */
import { ApiPromise, WsProvider } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { AccountData } from '@polkadot/types/interfaces/balances'
import BN from 'bn.js'

import Rpc from './services/Rpc'
import TX from './services/Tx'
import Query from './services/Query'

import { options } from './utils/options'
import { MangataGenericEvent } from './types/MangataGenericEvent'
import { TxOptions } from './types/TxOptions'
import Tx from './services/Tx'

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
    const api = await this.getApi()
    return Rpc.getChain(api)
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<string> {
    const api = await this.getApi()
    return Rpc.getNodeName(api)
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<string> {
    const api = await this.getApi()
    return Rpc.getNodeVersion(api)
  }

  /**
   * Retrieve the current nonce
   */

  public async getNonce(address: string): Promise<BN> {
    const api = await this.getApi()
    return Query.getNonce(api, address)
  }

  /**
   * Disconnect
   */

  public async disconnect(): Promise<void> {
    const api = await this.getApi()
    api.disconnect()
  }

  /**
   * Extrinsic to create pool
   */

  public async createPool(
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.createPool(
      api,
      account,
      firstTokenId,
      firstTokenAmount,
      secondTokenId,
      secondTokenAmount,
      txOptions
    )
  }

  /**
   * Sell asset
   */
  public async sellAsset(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
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
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.mintLiquidity(
      api,
      account,
      firstTokenId,
      secondTokenId,
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
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.burnLiquidity(
      api,
      account,
      firstTokenId,
      secondTokenId,
      liquidityTokenAmount,
      txOptions
    )
  }

  /**
   * Extrinsic to buy/swap bought asset id in bought asset amount for sold asset id, while
   * specifying max amount in: maximal amount you are willing to pay in sold asset id to
   * purchase bouth asset id in bought asset amount
   */
  public async buyAsset(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.buyAsset(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      amount,
      maxAmountIn,
      txOptions
    )
  }

  /**
   * Returns sell amount you need to pay in sold token id for bought token id in buy
   * amount, while specifying input reserve – reserve of sold token id, and output reserve
   * – reserve of bought token id
   */
  public async calculateBuyPrice(inputReserve: BN, outputReserve: BN, buyAmount: BN): Promise<BN> {
    const api = await this.getApi()
    return await Rpc.calculateBuyPrice(api, inputReserve, outputReserve, buyAmount)
  }

  /**
   * Returns bought asset amount returned by selling sold token id for bought token id in
   * sell amount, while specifying input reserve – reserve of sold token id, and output
   * reserve – reserve of bought token id
   */
  public async calculateSellPrice(
    inputReserve: BN,
    outputReserve: BN,
    sellAmount: BN
  ): Promise<BN> {
    const api = await this.getApi()
    return await Rpc.calculateSellPrice(api, inputReserve, outputReserve, sellAmount)
  }

  /**
   * Create Token (SUDO)
   */
  public async createToken(
    targetAddress: string,
    sudoAccount: string | KeyringPair,
    currencyValue: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.createToken(api, targetAddress, sudoAccount, currencyValue, txOptions)
  }

  /**
   * Mint Asset (SUDO)
   */
  public async mintAsset(
    sudoAccount: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.mintAsset(api, sudoAccount, tokenId, address, amount, txOptions)
  }

  /**
   * Returns amounts of first token id and second token id, while specifying first, second
   * token id liquidity asset amount of pool to burn
   */
  public async getBurnAmount(
    firstTokenId: string,
    secondTokenId: string,
    liquidityAssetAmount: BN
  ): Promise<any> {
    const api = await this.getApi()
    return await Rpc.getBurnAmount(api, firstTokenId, secondTokenId, liquidityAssetAmount)
  }

  /**
   * Returns bought asset amount returned by selling sold token id for bought token id in
   * sell amount
   */

  public async calculateSellPriceId(
    soldTokenId: string,
    boughtTokenId: string,
    sellAmount: BN
  ): Promise<BN> {
    const api = await this.getApi()
    return await Rpc.calculateSellPriceId(api, soldTokenId, boughtTokenId, sellAmount)
  }

  /**
   * Returns sell amount you need to pay in sold token id for bought token id in buy amount
   */

  public async calculateBuyPriceId(
    soldTokenId: string,
    boughtTokenId: string,
    buyAmount: BN
  ): Promise<BN> {
    const api = await this.connect()
    return await Rpc.calculateBuyPriceId(api, soldTokenId, boughtTokenId, buyAmount)
  }

  /**
   * Get amount of token id in pool
   */
  public async getAmountOfTokenIdInPool(
    firstTokenId: string,
    secondTokenId: string
  ): Promise<BN[]> {
    const api = await this.getApi()
    return await Query.getAmountOfTokenIdInPool(api, firstTokenId, secondTokenId)
  }

  /**
   * Returns liquidity asset id while specifying first and second TokenId returns same liquidity asset id when specifying other way
   * around – second and first TokenId
   */
  public async getLiquidityAssetId(firstTokenId: string, secondTokenId: string): Promise<BN> {
    const api = await this.getApi()
    return await Query.getLiquidityAssetId(api, firstTokenId, secondTokenId)
  }

  /**
   * Returns pool corresponding to specified liquidity asset ID in from of first and second * token id pair
   */
  public async getLiquidityPool(liquidityAssetId: string): Promise<BN[]> {
    const api = await this.getApi()
    return await Query.getLiquidityPool(api, liquidityAssetId)
  }

  /**
   * Returns amount of currency ID in Treasury
   */
  public async getTreasury(tokenId: string): Promise<AccountData> {
    const api = await this.getApi()
    return await Query.getTreasury(api, tokenId)
  }

  /**
   * Returns amount of currency ID in Treasury Burn
   */
  public async getTreasuryBurn(tokenId: string): Promise<AccountData> {
    const api = await this.getApi()
    return await Query.getTreasuryBurn(api, tokenId)
  }

  /**
   * Extrinsic that transfers TokenId in value amount from origin to destination
   */

  public async transferToken(
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.transferToken(api, account, tokenId, address, amount, txOptions)
  }

  /**
   * Extrinsic that transfers all token_id from origin to destination
   */

  public async transferTokenAll(
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi()
    return await TX.transferAllToken(api, account, tokenId, address, txOptions)
  }

  /**
   * Returns total issuance of Token Id
   */

  public async getTotalIssuance(tokenId: string): Promise<BN> {
    const api = await this.getApi()
    return await Query.getTotalIssuance(api, tokenId)
  }

  /**
   * Returns vec of locked tokenId of an specified account Id Address and tokenId
   */
  public async getLock(address: string, tokenId: string) {
    const api = await this.getApi()
    return await Query.getLock(api, address, tokenId)
  }

  /**
   * Returns token balance for address
   */
  public async getTokenBalance(tokenId: string, address: string): Promise<AccountData> {
    const api = await this.getApi()
    return await Query.getTokenBalance(api, address, tokenId)
  }

  /**
   * Returns next CurencyId, CurrencyId that will be used for next created token
   */
  public async getNextTokenId(): Promise<BN> {
    const api = await this.getApi()
    return await Query.getNextTokenId(api)
  }

  public async getBridgeTokens(): Promise<
    {
      assetId: string
      info: {
        name: string
        symbol: string
        decimals: number
        description: string
      }
      ethereumAddress: string
    }[]
  > {
    const api = await this.getApi()
    const bridgedTokens = await Query.getBridgedTokens(api)
    const bridgedTokensFormatted: {
      assetId: string
      info: {
        name: string
        symbol: string
        decimals: number
        description: string
      }
      ethereumAddress: string
    }[] = []

    for (const item of bridgedTokens) {
      // `item` is a Promise, therefore we await it
      const bridgedAsset = await item

      bridgedTokensFormatted.push(bridgedAsset)
    }

    return bridgedTokensFormatted
  }

  public async getTokenInfo(tokenId: string) {
    const api = await this.getApi()
    return await Query.getTokenInfo(api, tokenId)
  }

  public async getLiquidityTokenIds(): Promise<string[]> {
    const api = await this.getApi()
    return await Query.getLiquidityTokenIds(api)
  }

  /**
   * @deprecated This method will be deprecated
   */
  public async bridgeERC20ToEthereum(
    account: string | KeyringPair,
    tokenAddress: string,
    ethereumAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ) {
    const api = await this.getApi()
    return await Tx.bridgeERC20ToEthereum(
      api,
      account,
      tokenAddress,
      ethereumAddress,
      amount,
      txOptions
    )
  }

  /**
   * @deprecated This method will be deprecated
   */
  public async bridgeEthToEthereum(
    account: string | KeyringPair,
    ethereumAddress: string,
    amount: BN,
    txOptions?: TxOptions
  ) {
    const api = await this.getApi()
    return await Tx.bridgeEthToEthereum(api, account, ethereumAddress, amount, txOptions)
  }
}
