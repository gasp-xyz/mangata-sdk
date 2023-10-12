import { BN } from "@polkadot/util";
import { deactivateLiquidity } from "./methods/xyk/deactivateLiquidity";
import {
  ActivateLiquidityFee,
  BurnLiquidity,
  BurnLiquidityFee,
  ClaimRewardsFee,
  CreatePool,
  CreatePoolFee,
  DeactivateLiquidityFee,
  Liquidity,
  MintLiquidity,
  MintLiquidityFee,
  MultiswapBuyAsset,
  MultiswapSellAsset,
  Price,
  Reserve,
  Rewards
} from "./types/xyk";
import { activateLiquidity } from "./methods/xyk/activateLiquidity";
import { burnLiquidity } from "./methods/xyk/burnLiquidity";
import { transferAllTokens } from "./methods/tokens/transferAllTokens";
import { transferTokens } from "./methods/tokens/transferTokens";

import {
  Transfer,
  TransferAllFee,
  TransferTokenFee,
  TransferTokens
} from "./types/tokens";
import {
  Address,
  MangataInstance,
  ExtrinsicCommon,
  Prettify,
  TokenAmount,
  TokenId
} from "./types/common";
import { mintLiquidity } from "./methods/xyk/mintLiquidity";
import { depositFromParachain } from "./methods/xTokens/depositFromParachain";
import {
  Deposit,
  DepositFromKusamaFee,
  DepositFromParachainFee,
  DepositFromStatemineFee,
  MoonriverWithdraw,
  RelayDeposit,
  RelayWithdraw,
  Withdraw,
  WithdrawFee,
  WithdrawKsmFee
} from "./types/xTokens";
import { createPool } from "./methods/xyk/createPool";
import { claimRewards } from "./methods/xyk/claimRewards";
import { claimRewardsAll } from "./methods/xyk/claimRewardsAll";
import { calculateBuyPriceId } from "./methods/rpc/calculateBuyPriceId";
import { calculateSellPriceId } from "./methods/rpc/calculateSellPriceId";
import { getBurnAmount } from "./methods/rpc/getBurnAmount";
import { calculateSellPrice } from "./methods/rpc/calculateSellPrice";
import { calculateBuyPrice } from "./methods/rpc/calculateBuyPrice";
import { calculateRewardsAmount } from "./methods/rpc/calculateRewardsAmount";
import { getNodeVersion } from "./methods/rpc/getNodeVersion";
import { getNodeName } from "./methods/rpc/getNodeName";
import { getChain } from "./methods/rpc/getChain";
import { getPools } from "./methods/query/getPools";
import { getPool } from "./methods/query/getPool";
import { getLiquidityPool } from "./methods/query/getLiquidityPool";
import { getAmountOfTokensInPool } from "./methods/query/getAmountOfTokensInPool";
import { getInvestedPools } from "./methods/query/getInvestedPools";
import { getTotalIssuanceOfTokens } from "./methods/query/getTotalIssuanceOfTokens";
import { getOwnedTokens } from "./methods/query/getOwnedTokens";
import { getAssetsInfo } from "./methods/query/getAssetsInfo";
import { getBlockNumber } from "./methods/query/getBlockNumber";
import { getLiquidityTokens } from "./methods/query/getLiquidityTokens";
import { getLiquidityTokenIds } from "./methods/query/getLiquidityTokenIds";
import { getTokenInfo } from "./methods/query/getTokenInfo";
import { getTokenBalance } from "./methods/query/getTokenBalance";
import { getTotalIssuance } from "./methods/query/getTotalIssuance";
import { getLiquidityTokenId } from "./methods/query/getLiquidityTokenId";
import { getNonce } from "./methods/query/getNonce";
import { withdraw } from "./methods/xTokens/withdraw";
import { withdrawKsm } from "./methods/xTokens/withdrawKsm";
import { batch } from "./methods/utility/batch";
import { batchAll } from "./methods/utility/batchAll";
import { forceBatch } from "./methods/utility/forceBatch";
import { getOrCreateInstance } from "./utils/getOrCreateInstance";
import { waitForNewBlock } from "./methods/rpc/waitForNewBlock";
import { depositFromKusama } from "./methods/xTokens/depositFromKusama";
import { depositFromStatemine } from "./methods/xTokens/depositFromStatemine";
import { calculateMintingFutureRewards } from "./utils/calculateMintingFutureRewards";
import { Batch } from "./types/utility";
import { getActivateLiquidityFee } from "./methods/fee/getActivateLiquidityFee";
import { getDepositFromParachainFee } from "./methods/fee/getDepositFromParachainFee";
import { getWithdrawFee } from "./methods/fee/getWithdrawFee";
import { getWithdrawKsmFee } from "./methods/fee/getWithdrawKsmFee";
import { getDeactivateLiquidityFee } from "./methods/fee/getDeactivateLiquidityFee";
import { getClaimRewardsFee } from "./methods/fee/getClaimRewardsFee";
import { getCreatePoolFee } from "./methods/fee/getCreatePoolFee";
import { getMintLiquidityFee } from "./methods/fee/getMintLiquidityFee";
import { getBurnLiquidityFee } from "./methods/fee/getBurnLiquidityFee";
import { getTransferAllTokenFee } from "./methods/fee/getTransferAllTokenFee";
import { getTransferTokenFee } from "./methods/fee/getTransferTokenFee";
import { multiswapBuyAsset } from "./methods/xyk/multiswapBuyAsset";
import { multiswapSellAsset } from "./methods/xyk/multiswapSellAsset";
import { getDepositFromKusamaFee } from "./methods/fee/getDepositFromKusamaFee";
import { getDepositFromStatemineFee } from "./methods/fee/getDepositFromStatemineFee";
import { isBuyAssetLockFree } from "./methods/rpc/isBuyAssetLockFree";
import { isSellAssetLockFree } from "./methods/rpc/isSellAssetLockFree";
import { withdrawToMoonriver } from "./methods/xTokens/withdrawToMoonriver";
import { getWithdrawFromMoonriverFee } from "./methods/fee/getWithdrawFromMoonriverFee";
import {getTradeableTokens} from "./methods/rpc/getTradeableTokens";
import {getLiquidityTokensForTrading} from "./methods/rpc/getLiquidityTokensForTrading";
import { logger } from "./utils/mangataLogger";

/**
 * Creates a MangataInstance object with various methods for interacting with the Mangata node.
 * @param urls - An array of URLs for connecting to the Mangata node.
 * @returns A MangataInstance object.
 */
export function createMangataInstance(urls: string[]): MangataInstance {
  const instancePromise = getOrCreateInstance(urls);
  logger.info("Endpoints: ", urls);

  return {
    api:  () => instancePromise,
    batch:  (args: Batch) =>  batch(instancePromise, args),
    batchAll:  (args: Batch) =>  batchAll(instancePromise, args),
    forceBatch:  (args: Batch) =>  forceBatch(instancePromise, args),
    xTokens: {
      depositFromParachain:  (args: Deposit) =>
         depositFromParachain(args),
      depositFromKusama:  (args: RelayDeposit) =>
         depositFromKusama(args),
      depositFromStatemine:  (args: RelayDeposit) =>
         depositFromStatemine(args),
      withdraw:  (args: Withdraw) =>  withdraw(instancePromise, args),
      withdrawKsm:  (args: RelayWithdraw) =>
         withdrawKsm(instancePromise, args),
      withdrawToMoonriver:  (args: MoonriverWithdraw) =>
         withdrawToMoonriver(instancePromise, args)
    },
    xyk: {
      deactivateLiquidity:  (args: Liquidity) =>
         deactivateLiquidity(instancePromise, args, false),
      activateLiquidity: (
        args: Liquidity,
        balanceFrom:
          | "AvailableBalance"
          | "StakedUnactivatedReserves"
          | "UnspentReserves" = "AvailableBalance"
      ) => activateLiquidity(instancePromise, args, balanceFrom, false),
      burnLiquidity:  (args: BurnLiquidity) =>
         burnLiquidity(instancePromise, args, false),
      mintLiquidity:  (args: MintLiquidity) =>
         mintLiquidity(instancePromise, args, false),
      createPool:  (args: CreatePool) =>
         createPool(instancePromise, args, false),
      claimRewardsAll:  (args: ExtrinsicCommon) =>
         claimRewardsAll(instancePromise, args, false),
      claimRewards:  (args: Prettify<Omit<Liquidity, "amount">>) =>
         claimRewards(instancePromise, args, false),
      multiswapBuyAsset:  (args: MultiswapBuyAsset) =>
         multiswapBuyAsset(instancePromise, args, false),
      multiswapSellAsset:  (args: MultiswapSellAsset) =>
         multiswapSellAsset(instancePromise, args, false)
    },
    rpc: {
      getTradeableTokens: () => getTradeableTokens(instancePromise),
      getLiquidityTokensForTrading: ()  => getLiquidityTokensForTrading(instancePromise),
      isBuyAssetLockFree:  (tokenIds: TokenId[], amount: BN) =>
         isBuyAssetLockFree(instancePromise, tokenIds, amount),
      isSellAssetLockFree:  (tokenIds: TokenId[], amount: BN) =>
         isSellAssetLockFree(instancePromise, tokenIds, amount),
      calculateBuyPriceId:  (
        soldTokenId: TokenId,
        boughtTokenId: TokenId,
        amount: TokenAmount
      ) =>
         calculateBuyPriceId(
          instancePromise,
          soldTokenId,
          boughtTokenId,
          amount
        ),
      calculateSellPriceId:  (
        soldTokenId: TokenId,
        boughtTokenId: TokenId,
        amount: TokenAmount
      ) =>
         calculateSellPriceId(
          instancePromise,
          soldTokenId,
          boughtTokenId,
          amount
        ),
      getBurnAmount:  (args: Price) =>
         getBurnAmount(instancePromise, args),
      calculateSellPrice:  (args: Reserve) =>
         calculateSellPrice(instancePromise, args),
      calculateBuyPrice:  (args: Reserve) =>
         calculateBuyPrice(instancePromise, args),
      calculateRewardsAmount:  (args: Rewards) =>
         calculateRewardsAmount(instancePromise, args),
      getNodeVersion:  () =>  getNodeVersion(instancePromise),
      getNodeName:  () =>  getNodeName(instancePromise),
      getChain:  () =>  getChain(instancePromise),
      waitForNewBlock:  (blockNumber?: number) =>
         waitForNewBlock(instancePromise, blockNumber)
    },
    tokens: {
      transferAllTokens:  (args: Transfer) =>
         transferAllTokens(instancePromise, args, false),
      transferTokens:  (args: TransferTokens) =>
         transferTokens(instancePromise, args, false)
    },
    submitableExtrinsic: {
      createPool:  (args: CreatePool) =>
         createPool(instancePromise, args, true),
      claimRewards:  (args: Omit<Liquidity, "amount">) =>
         claimRewards(instancePromise, args, true),
      mintLiquidity:  (args: MintLiquidity) =>
         mintLiquidity(instancePromise, args, true),
      burnLiquidity:  (args: BurnLiquidity) =>
         burnLiquidity(instancePromise, args, true),
      activateLiquidity: (
        args: Liquidity,
        balanceFrom:
          | "AvailableBalance"
          | "StakedUnactivatedReserves"
          | "UnspentReserves" = "AvailableBalance"
      ) =>  activateLiquidity(instancePromise, args, balanceFrom, true),
      deactivateLiquidity:  (args: Liquidity) =>
         deactivateLiquidity(instancePromise, args, true),
      transferAllTokens:  (args: Transfer) =>
         transferAllTokens(instancePromise, args, true),
      transferTokens:  (args: Transfer & { amount: TokenAmount }) =>
         transferTokens(instancePromise, args, true),
      multiswapBuyAsset:  (args: MultiswapBuyAsset) =>
         multiswapBuyAsset(instancePromise, args, true),
      multiswapSellAsset:  (args: MultiswapSellAsset) =>
         multiswapSellAsset(instancePromise, args, true)
    },
    query: {
      getNonce:  (address: Address) =>
         getNonce(instancePromise, address),
      getLiquidityTokenId:  (
        firstTokenId: TokenId,
        secondTokenId: TokenId
      ) =>
         getLiquidityTokenId(instancePromise, firstTokenId, secondTokenId),
      getTotalIssuance:  (tokenId: TokenId) =>
         getTotalIssuance(instancePromise, tokenId),
      getTokenBalance:  (tokenId: TokenId, address: Address) =>
         getTokenBalance(instancePromise, tokenId, address),
      getTokenInfo:  (tokenId: TokenId) =>
         getTokenInfo(instancePromise, tokenId),
      getLiquidityTokenIds:  () =>
         getLiquidityTokenIds(instancePromise),
      getLiquidityTokens:  () =>  getLiquidityTokens(instancePromise),
      getBlockNumber:  () =>  getBlockNumber(instancePromise),
      getOwnedTokens:  (address: Address) =>
         getOwnedTokens(instancePromise, address),
      getAssetsInfo:  () =>  getAssetsInfo(instancePromise),
      getInvestedPools:  (address: Address) =>
         getInvestedPools(instancePromise, address),
      getAmountOfTokensInPool: (
        firstTokenId: TokenId,
        secondTokenId: TokenId
      ) =>
         getAmountOfTokensInPool(
          instancePromise,
          firstTokenId,
          secondTokenId
        ),
      getLiquidityPool:  (liquidityTokenId: TokenId) =>
         getLiquidityPool(instancePromise, liquidityTokenId),
      getPool:  (liquidityTokenId: TokenId) =>
         getPool(instancePromise, liquidityTokenId),
      getPools:  () =>  getPools(instancePromise),
      getTotalIssuanceOfTokens:  () =>
         getTotalIssuanceOfTokens(instancePromise)
    },
    fee: {
      depositFromParachain:  (args: DepositFromParachainFee) =>
         getDepositFromParachainFee(args),
      depositFromKusama: (args: DepositFromKusamaFee) =>
        getDepositFromKusamaFee(args),
      depositFromStatemine: (args: DepositFromStatemineFee) =>
        getDepositFromStatemineFee(args),
      withdraw:  (args: WithdrawFee) =>
         getWithdrawFee(instancePromise, args),
      withdrawKsm:  (args: WithdrawKsmFee) =>
         getWithdrawKsmFee(instancePromise, args),
      withdrawFromMoonriver:  (args: MoonriverWithdraw) =>
         getWithdrawFromMoonriverFee(instancePromise, args),
      activateLiquidity:  (args: ActivateLiquidityFee) =>
         getActivateLiquidityFee(instancePromise, args),
      deactivateLiquidity:  (args: DeactivateLiquidityFee) =>
         getDeactivateLiquidityFee(instancePromise, args),
      claimRewards:  (args: ClaimRewardsFee) =>
         getClaimRewardsFee(instancePromise, args),
      createPool:  (args: CreatePoolFee) =>
         getCreatePoolFee(instancePromise, args),
      mintLiquidity:  (args: MintLiquidityFee) =>
         getMintLiquidityFee(instancePromise, args),
      burnLiquidity:  (args: BurnLiquidityFee) =>
         getBurnLiquidityFee(instancePromise, args),
      transferAllToken:  (args: TransferAllFee) =>
         getTransferAllTokenFee(instancePromise, args),
      transferToken:  (args: TransferTokenFee) =>
         getTransferTokenFee(instancePromise, args)
    },
    util: {
      getUrls: () => urls,
      calculateMintingFutureRewards:  (
        liquidityTokenId: string,
        mintingAmount: BN,
        blocksToPass: BN
      ) =>
         calculateMintingFutureRewards(
          instancePromise,
          liquidityTokenId,
          mintingAmount,
          blocksToPass
        )
    }
  };
}
