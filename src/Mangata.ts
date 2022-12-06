import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { options } from "@mangata-finance/types";
import { BN, hexToString } from "@polkadot/util";

import { Rpc } from "./services/Rpc";
import { Tx } from "./services/Tx";
import { Query } from "./services/Query";
import { Fee } from "./services/Fee";
import {
  TTokenAddress,
  TToken,
  TBalances,
  TMainTokens,
  TokenBalance,
  TTokenId,
  TPoolWithShare,
  TPoolWithRatio
} from "./types/AssetInfo";
import { MangataGenericEvent } from "./types/MangataGenericEvent";
import { TxOptions, XcmTxOptions } from "./types/TxOptions";
import { calculateFutureRewardsAmountForMinting } from "./utils/calculateFutureRewardsAmount";

/**
 * @class Mangata
 * @author Mangata Finance
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance.
 */
export class Mangata {
  private api: Promise<ApiPromise>;
  private urls: string[];
  private static instanceMap: Map<string, Mangata> = new Map<string, Mangata>();

  /**
   * The Mangata's constructor is private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(urls: string[]) {
    this.urls = urls;
    this.api = (async () => {
      const api = await this.connectToNode(urls);
      return api;
    })();
  }

  /**
   * Initialised via create method with proper types and rpc
   * for Mangata
   */
  private async connectToNode(urls: string[]) {
    const provider = new WsProvider(urls, 5000);
    const api = await ApiPromise.create(
      options({ provider, throwOnConnect: true, throwOnUnknown: true })
    );
    return api;
  }

  /**
   * The static method that controls the access to the Mangata instance.
   */
  public static getInstance(urls: string[]): Mangata {
    if (!Mangata.instanceMap.has(JSON.stringify(urls))) {
      Mangata.instanceMap.set(JSON.stringify(urls), new Mangata(urls));
      return Mangata.instanceMap.get(JSON.stringify(urls))!;
    } else {
      return Mangata.instanceMap.get(JSON.stringify(urls))!;
    }
  }

  /**
   * Api instance of the connected node
   */
  public async getApi(): Promise<ApiPromise> {
    // Because we assign this.api synchronously, repeated calls to
    // method() are guaranteed to always reuse the same promise.
    if (!this.api) {
      this.api = this.connectToNode(this.urls);
    }
    return this.api;
  }

  /**
   * Uri of the connected node
   */
  public getUrls(): string[] {
    return this.urls;
  }

  /**
   * Wait for the new block
   * (by default 2) - Do not use blockCount = 1 it gives an error
   * when executing transactions
   * @param {number} blockCount - The block number to wait for
   */
  public async waitForNewBlock(blockCount?: number): Promise<boolean> {
    let count = 0;
    const api = await this.getApi();

    const numberOfBlocks = blockCount || 2;

    return new Promise(async (resolve) => {
      const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
        if (++count === numberOfBlocks) {
          unsubscribe();
          resolve(true);
        }
      });
    });
  }

  /**
   * Chain name of the connected node
   */
  public async getChain(): Promise<string> {
    const api = await this.getApi();
    return Rpc.getChain(api);
  }

  /**
   * Node name of the connected node
   */
  public async getNodeName(): Promise<string> {
    const api = await this.getApi();
    return Rpc.getNodeName(api);
  }

  /**
   * Node version of the connected node
   */
  public async getNodeVersion(): Promise<string> {
    const api = await this.getApi();
    return Rpc.getNodeVersion(api);
  }

  /**
   * Get the current nonce of the account
   */
  public async getNonce(address: TTokenAddress): Promise<BN> {
    const api = await this.getApi();
    return Query.getNonce(api, address);
  }

  /**
   * Disconnect from the node
   */
  public async disconnect(): Promise<void> {
    const api = await this.getApi();
    await api.disconnect();
  }

  public async sendTokenFromParachainToMangata(
    url: string,
    tokenSymbol: string,
    destWeight: string,
    account: string | KeyringPair,
    mangataAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const api = await this.getApi();
    return await Tx.sendTokenFromParachainToMangata(
      api,
      url,
      tokenSymbol,
      destWeight,
      account,
      mangataAddress,
      amount,
      txOptions
    );
  }

  public async sendTokenFromMangataToParachain(
    tokenSymbol: string,
    withWeight: string,
    parachainId: number,
    account: string | KeyringPair,
    destinationAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const api = await this.getApi();
    return await Tx.sendTokenFromMangataToParachain(
      api,
      tokenSymbol,
      withWeight,
      parachainId,
      account,
      destinationAddress,
      amount,
      txOptions
    );
  }

  public async sendTokenFromParachainToMangataFee(
    url: string,
    tokenSymbol: string,
    destWeight: string,
    account: string | KeyringPair,
    mangataAddress: string,
    amount: BN
  ) {
    const api = await this.getApi();
    return await Fee.sendTokenFromParachainToMangataFee(
      api,
      url,
      tokenSymbol,
      destWeight,
      account,
      mangataAddress,
      amount
    );
  }

  public async sendTokenFromMangataToParachainFee(
    tokenSymbol: string,
    withWeight: string,
    parachainId: number,
    account: string | KeyringPair,
    destinationAddress: string,
    amount: BN
  ) {
    const api = await this.getApi();
    return await Fee.sendTokenFromMangataToParachainFee(
      api,
      tokenSymbol,
      withWeight,
      parachainId,
      account,
      destinationAddress,
      amount
    );
  }

  public async sendKusamaTokenFromRelayToParachain(
    kusamaEndpointUrl: string,
    ksmAccount: string | KeyringPair,
    destinationMangataAddress: string,
    amount: BN,
    parachainId: number = 2110,
    txOptions?: XcmTxOptions
  ) {
    return await Tx.sendKusamaTokenFromRelayToParachain(
      kusamaEndpointUrl,
      ksmAccount,
      destinationMangataAddress,
      amount,
      parachainId,
      txOptions
    );
  }

  public async sendKusamaTokenFromRelayToParachainFee(
    kusamaEndpointUrl: string,
    ksmAccount: string | KeyringPair,
    destinationMangataAddress: string,
    amount: BN,
    parachainId: number = 2110
  ) {
    return await Fee.sendKusamaTokenFromRelayToParachainFee(
      kusamaEndpointUrl,
      ksmAccount,
      destinationMangataAddress,
      amount,
      parachainId
    );
  }

  public async sendKusamaTokenFromParachainToRelay(
    mangataAccount: string | KeyringPair,
    destinationKusamaAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const api = await this.getApi();
    return await Tx.sendKusamaTokenFromParachainToRelay(
      api,
      mangataAccount,
      destinationKusamaAddress,
      amount,
      txOptions
    );
  }

  public async sendKusamaTokenFromParachainToRelayFee(
    mangataAccount: string | KeyringPair,
    destinationKusamaAddress: string,
    amount: BN
  ) {
    const api = await this.getApi();
    return await Fee.sendKusamaTokenFromParachainToRelayFee(
      api,
      mangataAccount,
      destinationKusamaAddress,
      amount
    );
  }

  public async sendTurTokenFromTuringToMangata(
    turingUrl: string,
    account: string | KeyringPair,
    mangataAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const api = await this.getApi();
    return await Tx.sendTurTokenFromTuringToMangata(
      api,
      turingUrl,
      account,
      mangataAddress,
      amount,
      txOptions
    );
  }

  public async sendTurTokenFromMangataToTuring(
    mangataAccount: string | KeyringPair,
    destinationAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const api = await this.getApi();
    return await Tx.sendTurTokenFromMangataToTuring(
      api,
      mangataAccount,
      destinationAddress,
      amount,
      txOptions
    );
  }

  public async sendTurTokenFromTuringToMangataFee(
    turingUrl: string,
    account: string | KeyringPair,
    mangataAddress: string,
    amount: BN
  ) {
    const api = await this.getApi();
    return await Fee.sendTurTokenFromTuringToMangataFee(
      api,
      turingUrl,
      account,
      mangataAddress,
      amount
    );
  }

  public async sendTurTokenFromMangataToTuringFee(
    mangataAccount: string | KeyringPair,
    destinationAddress: string,
    amount: BN
  ) {
    const api = await this.getApi();
    return await Fee.sendTurTokenFromMangataToTuringFee(
      api,
      mangataAccount,
      destinationAddress,
      amount
    );
  }

  public async activateLiquidity(
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN,
    txOptions?: TxOptions
  ) {
    const api = await this.getApi();
    return await Tx.activateLiquidity(
      api,
      account,
      liquditityTokenId,
      amount,
      txOptions
    );
  }

  public async deactivateLiquidity(
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN,
    txOptions?: TxOptions
  ) {
    const api = await this.getApi();
    return await Tx.deactivateLiquidity(
      api,
      account,
      liquditityTokenId,
      amount,
      txOptions
    );
  }

  public async calculateFutureRewardsAmountForMinting(
    liquidityTokenId: string,
    mintingAmount: BN,
    blocksToPass: BN
  ) {
    const api = await this.getApi();
    return await calculateFutureRewardsAmountForMinting(
      api,
      liquidityTokenId,
      mintingAmount,
      blocksToPass
    );
  }

  public async calculateRewardsAmount(
    address: string,
    liquidityTokenId: string
  ): Promise<BN> {
    const api = await this.getApi();
    return await Rpc.calculateRewardsAmount(api, address, liquidityTokenId);
  }

  public async claimRewardsFee(
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN
  ) {
    const api = await this.getApi();
    return await Fee.claimRewardsFee(api, account, liquditityTokenId, amount);
  }

  public async claimRewards(
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN,
    txOptions?: TxOptions
  ) {
    const api = await this.getApi();
    return await Tx.claimRewards(
      api,
      account,
      liquditityTokenId,
      amount,
      txOptions
    );
  }

  public async createPoolFee(
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN
  ) {
    const api = await this.getApi();
    return await Fee.createPoolFee(
      api,
      account,
      firstTokenId,
      firstTokenAmount,
      secondTokenId,
      secondTokenAmount
    );
  }

  /**
   * Extrinsic to create pool
   * @param {string | Keyringpair} account
   * @param {string} firstTokenId
   * @param {BN} firstTokenAmount
   * @param {string} secondTokenId
   * @param {BN} secondTokenAmount
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async createPool(
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    return await Tx.createPool(
      api,
      account,
      firstTokenId,
      firstTokenAmount,
      secondTokenId,
      secondTokenAmount,
      txOptions
    );
  }

  public async sellAssetFee(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN
  ): Promise<string> {
    const api = await this.getApi();
    return await Fee.sellAssetFee(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      amount,
      minAmountOut
    );
  }

  /**
   * Extrinsic to sell/swap sold token id in sold token amount for bought token id,
   * while specifying min amount out: minimal expected bought token amount
   *
   * @param {string | Keyringpair} account
   * @param {string} soldAssetId
   * @param {string} boughtAssetId
   * @param {BN} amount
   * @param {BN} minAmountOut
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async sellAsset(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    return await Tx.sellAsset(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      amount,
      minAmountOut,
      txOptions
    );
  }

  public async mintLiquidityFee(
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN
  ): Promise<string> {
    const api = await this.getApi();
    return await Fee.mintLiquidityFee(
      api,
      account,
      firstTokenId,
      secondTokenId,
      firstTokenAmount,
      expectedSecondTokenAmount
    );
  }

  /**
   * Extrinsic to add liquidity to pool, while specifying first token id
   * and second token id and first token amount. Second token amount is calculated in block, * but cannot exceed expected second token amount
   *
   * @param {string | Keyringpair} account
   * @param {string} firstTokenId
   * @param {string} secondTokenId
   * @param {BN} firstTokenAmount
   * @param {BN} expectedSecondTokenAmount
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async mintLiquidity(
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    return await Tx.mintLiquidity(
      api,
      account,
      firstTokenId,
      secondTokenId,
      firstTokenAmount,
      expectedSecondTokenAmount,
      txOptions
    );
  }

  public async burnLiquidityFee(
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN
  ): Promise<string> {
    const api = await this.getApi();
    return await Fee.burnLiquidityFee(
      api,
      account,
      firstTokenId,
      secondTokenId,
      liquidityTokenAmount
    );
  }

  /**
   * Extrinsic to remove liquidity from liquidity pool, specifying first token id and
   * second token id of a pool and liquidity token amount you wish to burn
   *
   * @param {string | Keyringpair} account
   * @param {string} firstTokenId
   * @param {string} secondTokenId
   * @param {BN} liquidityTokenAmount
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async burnLiquidity(
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    return await Tx.burnLiquidity(
      api,
      account,
      firstTokenId,
      secondTokenId,
      liquidityTokenAmount,
      txOptions
    );
  }

  public async buyAssetFee(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN
  ): Promise<string> {
    const api = await this.getApi();
    return await Fee.buyAssetFee(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      amount,
      maxAmountIn
    );
  }

  /**
   * Extrinsic to buy/swap bought token id in bought token amount for sold token id, while
   * specifying max amount in: maximal amount you are willing to pay in sold token id to
   * purchase bought token id in bought token amount.
   *
   * @param {string | Keyringpair} account
   * @param {string} soldAssetId
   * @param {string} boughtAssetId
   * @param {BN} amount
   * @param {BN} maxAmountIn
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async buyAsset(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    return await Tx.buyAsset(
      api,
      account,
      soldAssetId,
      boughtAssetId,
      amount,
      maxAmountIn,
      txOptions
    );
  }

  /**
   * Returns sell amount you need to pay in sold token id for bought token id in buy
   * amount, while specifying input reserve – reserve of sold token id, and output reserve
   * – reserve of bought token id
   *
   * @param {BN} inputReserve
   * @param {BN} outputReserve
   * @param {BN} buyAmount
   *
   * @returns {BN}
   */
  public async calculateBuyPrice(
    inputReserve: BN,
    outputReserve: BN,
    buyAmount: BN
  ): Promise<BN> {
    const api = await this.getApi();
    return await Rpc.calculateBuyPrice(
      api,
      inputReserve,
      outputReserve,
      buyAmount
    );
  }

  /**
   * Returns bought token amount returned by selling sold token id for bought token id in
   * sell amount, while specifying input reserve – reserve of sold token id, and output
   * reserve – reserve of bought token id
   *
   * @param {BN} inputReserve
   * @param {BN} outputReserve
   * @param {BN} sellAmount
   *
   * @returns {BN}
   */
  public async calculateSellPrice(
    inputReserve: BN,
    outputReserve: BN,
    sellAmount: BN
  ): Promise<BN> {
    const api = await this.getApi();
    return await Rpc.calculateSellPrice(
      api,
      inputReserve,
      outputReserve,
      sellAmount
    );
  }

  /**
   * Returns bought token amount returned by selling sold token id for bought token id in
   * sell amount, while specifying input reserve – reserve of sold token id, and output
   * reserve – reserve of bought token id
   *
   * @param {BN} inputReserve
   * @param {BN} outputReserve
   * @param {BN} sellAmount
   *
   * @returns {BN}
   */
  public async getBurnAmount(
    firstTokenId: string,
    secondTokenId: string,
    liquidityAssetAmount: BN
  ): Promise<any> {
    const api = await this.getApi();
    return await Rpc.getBurnAmount(
      api,
      firstTokenId,
      secondTokenId,
      liquidityAssetAmount
    );
  }

  /**
   * Returns bought asset amount returned by selling sold token id for bought token id in
   * sell amount
   *
   * @param {string} soldTokenId
   * @param {string} boughtTokenId
   * @param {BN} sellAmount
   *
   * @returns {BN}
   */

  public async calculateSellPriceId(
    soldTokenId: string,
    boughtTokenId: string,
    sellAmount: BN
  ): Promise<BN> {
    const api = await this.getApi();
    return await Rpc.calculateSellPriceId(
      api,
      soldTokenId,
      boughtTokenId,
      sellAmount
    );
  }

  /**
   * Returns sell amount you need to pay in sold token id for bought token id in buy amount
   *
   * @param {string} soldTokenId
   * @param {string} boughtTokenId
   * @param {BN} buyAmount
   *
   * @returns {BN}
   *
   */

  public async calculateBuyPriceId(
    soldTokenId: string,
    boughtTokenId: string,
    buyAmount: BN
  ): Promise<BN> {
    const api = await this.getApi();
    return await Rpc.calculateBuyPriceId(
      api,
      soldTokenId,
      boughtTokenId,
      buyAmount
    );
  }

  /**
   * Returns amount of token ids in pool.
   *
   * @param {string} firstTokenId
   * @param {string} secondTokenId
   *
   * @returns {BN | Array}
   */
  public async getAmountOfTokenIdInPool(
    firstTokenId: TTokenId,
    secondTokenId: TTokenId
  ): Promise<BN[]> {
    const api = await this.getApi();
    return await Query.getAmountOfTokenIdInPool(
      api,
      firstTokenId,
      secondTokenId
    );
  }

  /**
   * Returns liquidity asset id while specifying first and second Token Id.
   * Returns same liquidity asset id when specifying other way
   * around – second and first Token Id
   *
   * @param {string} firstTokenId
   * @param {string} secondTokenId
   *
   * @returns {BN}
   */
  public async getLiquidityTokenId(
    firstTokenId: TTokenId,
    secondTokenId: TTokenId
  ): Promise<BN> {
    const api = await this.getApi();
    return await Query.getLiquidityTokenId(api, firstTokenId, secondTokenId);
  }

  /**
   * Returns pool corresponding to specified liquidity asset ID
   * @param {string} liquidityAssetId
   *
   * @returns {BN | Array}
   */
  public async getLiquidityPool(liquidityAssetId: string): Promise<BN[]> {
    const api = await this.getApi();
    return await Query.getLiquidityPool(api, liquidityAssetId);
  }

  public async transferTokenFee(
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN
  ): Promise<string> {
    const api = await this.getApi();
    return await Fee.transferTokenFee(api, account, tokenId, address, amount);
  }

  /**
   * Extrinsic that transfers Token Id in value amount from origin to destination
   * @param {string | Keyringpair} account
   * @param {string} tokenId
   * @param {string} address
   * @param {BN} amount
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async transferToken(
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    const result = await Tx.transferToken(
      api,
      account,
      tokenId,
      address,
      amount,
      txOptions
    );
    return result;
  }

  public async transferTokenAllFee(
    account: string | KeyringPair,
    tokenId: string,
    address: string
  ): Promise<string> {
    const api = await this.getApi();
    return await Fee.transferAllTokenFee(api, account, tokenId, address);
  }

  /**
   * Extrinsic that transfers all token Id from origin to destination
   * @param {string | Keyringpair} account
   * @param {string} tokenId
   * @param {string} address
   * @param {TxOptions} [txOptions]
   *
   * @returns {(MangataGenericEvent|Array)}
   */
  public async transferTokenAll(
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const api = await this.getApi();
    return await Tx.transferAllToken(api, account, tokenId, address, txOptions);
  }

  /**
   * Returns total issuance of Token Id
   * @param {string} tokenId
   *
   * @returns {BN}
   */
  public async getTotalIssuance(tokenId: string): Promise<BN> {
    const api = await this.getApi();
    return await Query.getTotalIssuance(api, tokenId);
  }

  /**
   * Returns token balance for address
   * @param {string} tokenId
   * @param {string} address
   *
   * @returns {TokenBalance}
   */
  public async getTokenBalance(
    tokenId: string,
    address: string
  ): Promise<TokenBalance> {
    const api = await this.getApi();
    return await Query.getTokenBalance(api, address, tokenId);
  }

  /**
   * Returns next CurencyId, CurrencyId that will be used for next created token
   */
  public async getNextTokenId(): Promise<BN> {
    const api = await this.getApi();
    return await Query.getNextTokenId(api);
  }

  /**
   * Returns token info
   * @param {string} tokenId
   */
  public async getTokenInfo(tokenId: string) {
    const api = await this.getApi();
    return await Query.getTokenInfo(api, tokenId);
  }

  public async getBlockNumber(): Promise<string> {
    const api = await this.getApi();
    return await Query.getBlockNumber(api);
  }

  public async getOwnedTokens(
    address: string
  ): Promise<Record<TTokenId, TToken> | null> {
    const api = await this.getApi();
    return await Query.getOwnedTokens(api, address);
  }

  /**
   * Returns liquditity token Ids
   * @returns {string | Array}
   */
  public async getLiquidityTokenIds(): Promise<string[]> {
    const api = await this.getApi();
    return await Query.getLiquidityTokenIds(api);
  }

  /**
   * Returns info about all assets
   */

  public async getAssetsInfo(): Promise<TMainTokens> {
    const api = await this.getApi();
    return await Query.getAssetsInfo(api);
  }

  public async getBalances(): Promise<TBalances> {
    const api = await this.getApi();
    return await Query.getBalances(api);
  }

  public async getLiquidityTokens(): Promise<TMainTokens> {
    const api = await this.getApi();
    return await Query.getLiquidityTokens(api);
  }

  public async getPool(liquditityTokenId: TTokenId): Promise<TPoolWithRatio> {
    const api = await this.getApi();
    return await Query.getPool(api, liquditityTokenId);
  }

  public async getInvestedPools(address: string): Promise<TPoolWithShare[]> {
    const api = await this.getApi();
    return await Query.getInvestedPools(api, address);
  }

  public async getPools(): Promise<TPoolWithRatio[]> {
    const api = await this.getApi();
    return await Query.getPools(api);
  }
}
