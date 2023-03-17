import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@mangata-finance/types";
import { deactivateLiquidity } from "./methods/xyk/deactivateLiquidity";
import {
  BurnLiquidity,
  BuyAsset,
  CreatePool,
  Liquidity,
  MintLiquidity,
  Price,
  Reserve,
  Rewards,
  SellAsset
} from "./types/xyk";
import { activateLiquidity } from "./methods/xyk/activateLiquidity";
import { burnLiquidity } from "./methods/xyk/burnLiquidity";
import { transferAllTokens } from "./methods/tokens/transferAllTokens";
import { transferTokens } from "./methods/tokens/transferTokens";

import "@mangata-finance/types";
import { Transfer } from "./types/tokens";
import { Address, Amount, TokenId } from "./types/common";
import { mintLiquidity } from "./methods/xyk/mintLiquidity";
import { deposit } from "./methods/xTokens/deposit";
import {
  Deposit,
  RelayDeposit,
  RelayWithdraw,
  Withdraw
} from "./types/xTokens";
import { buyAsset } from "./methods/xyk/buyAsset";
import { sellAsset } from "./methods/xyk/sellAsset";
import { createPool } from "./methods/xyk/createPool";
import { claimRewards } from "./methods/xyk/claimRewards";
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
import { getAmountOfTokenIdInPool } from "./methods/query/getAmountOfTokenIdInPool";
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
import { depositKsm } from "./methods/xTokens/depositKsm";
import {
  forTransferAllToken,
  TransferAllFee
} from "./methods/fee/forTransferAllToken";
import {
  forTransferToken,
  TransferTokenFee
} from "./methods/fee/forTransferToken";
import {
  BurnLiquidityFee,
  forBurnLiquidity
} from "./methods/fee/forBurnLiquidity";
import {
  forMintLiquidity,
  MintLiquidityFee
} from "./methods/fee/forMintLiquidity";
import { BuyAssetFee, forBuyAsset } from "./methods/fee/forBuyAsset";
import { forSellAsset, SellAssetFee } from "./methods/fee/forSellAsset";
import { CreatePoolFee, forCreatePool } from "./methods/fee/forCreatePool";
import {
  ClaimRewardsFee,
  forClaimRewards
} from "./methods/fee/forClaimRewards";
import {
  DeactivateLiquidityFee,
  forDeactivateLiquidity
} from "./methods/fee/forDeactivateLiquidity";
import {
  ActivateLiquidityFee,
  forActivateLiquidity
} from "./methods/fee/forActivateLiquidity";
import { forWithdraw, WithdrawFee } from "./methods/fee/forWithdraw";
import { Batch, batch } from "./methods/utility/batch";

export { ExtrinsicCommon } from "./types/common";
export { Batch } from "./methods/utility/batch";

/**
 * @author Mangata finance
 *
 * @returns object of all available methods for interaction with Mangata node
 */
export const Mangata = (function () {
  const instanceMap: Map<string, Promise<ApiPromise>> = new Map<
    string,
    Promise<ApiPromise>
  >();

  return {
    instance: (urls: string[]) => {
      /**
       * Generate a unique key for the given array of URLs.
       * Sort the URLs alphabetically before creating the key.
       * We want to ensure that the getInstance function only creates one instance
       * for any given array of URLs, regardless of the order of the URLs in the array
       */
      const key = JSON.stringify(urls.sort());

      // Check if an instance already exists for the given URLs.
      if (!instanceMap.has(key)) {
        // Create a new instance using the given URLs.
        const provider = new WsProvider(urls);
        const instance = ApiPromise.create(
          options({
            provider,
            throwOnConnect: true,
            throwOnUnknown: true,
            noInitWarn: true
          })
        );

        // Store the instance in the instanceMap.
        instanceMap.set(key, instance);
      }

      // Return the instance in a Promise.
      const instance = instanceMap.get(key)!;

      return {
        apiPromise: instance,
        batch: (args: Batch) => batch(instance, args),
        fee: {
          withdraw: (args: WithdrawFee) => forWithdraw(instance, args),
          activateLiquidity: (args: ActivateLiquidityFee) =>
            forActivateLiquidity(instance, args),
          deactivateLiquidity: (args: DeactivateLiquidityFee) =>
            forDeactivateLiquidity(instance, args),
          claimRewards: (args: ClaimRewardsFee) =>
            forClaimRewards(instance, args),
          createPool: (args: CreatePoolFee) => forCreatePool(instance, args),
          sellAsset: (args: SellAssetFee) => forSellAsset(instance, args),
          buyAsset: (args: BuyAssetFee) => forBuyAsset(instance, args),
          mintLiquidity: (args: MintLiquidityFee) =>
            forMintLiquidity(instance, args),
          burnLiquidity: (args: BurnLiquidityFee) =>
            forBurnLiquidity(instance, args),
          transferAllToken: (args: TransferAllFee) =>
            forTransferAllToken(instance, args),
          transferToken: (args: TransferTokenFee) =>
            forTransferToken(instance, args)
        },
        query: {
          getNonce: (address: Address) => getNonce(instance, address),
          getLiquidityTokenId: (
            firstTokenId: TokenId,
            secondTokenId: TokenId
          ) => getLiquidityTokenId(instance, firstTokenId, secondTokenId),
          getTotalIssuance: (tokenId: TokenId) =>
            getTotalIssuance(instance, tokenId),
          getTokenBalance: (address: Address, tokenId: TokenId) =>
            getTokenBalance(instance, address, tokenId),
          getTokenInfo: (tokenId: TokenId) => getTokenInfo(instance, tokenId),
          getLiquidityTokenIds: () => getLiquidityTokenIds(instance),
          getLiquidityTokens: () => getLiquidityTokens(instance),
          getBlockNumber: () => getBlockNumber(instance),
          getOwnedTokens: (address: Address) =>
            getOwnedTokens(instance, address),
          getAssetsInfo: () => getAssetsInfo(instance),
          getInvestedPools: (address: Address) =>
            getInvestedPools(instance, address),
          getAmountOfTokenIdInPool: (
            firstTokenId: TokenId,
            secondTokenId: TokenId
          ) => getAmountOfTokenIdInPool(instance, firstTokenId, secondTokenId),
          getLiquidityPool: (liquidityTokenId: TokenId) =>
            getLiquidityPool(instance, liquidityTokenId),
          getPool: (liquidityTokenId: TokenId) =>
            getPool(instance, liquidityTokenId),
          getPools: () => getPools(instance),
          getTotalIssuanceOfTokens: () => getTotalIssuanceOfTokens(instance)
        },
        rpc: {
          calculateBuyPriceId: (args: Price) =>
            calculateBuyPriceId(instance, args),
          calculateSellPriceId: (args: Price) =>
            calculateSellPriceId(instance, args),
          getBurnAmount: (args: Price) => getBurnAmount(instance, args),
          calculateSellPrice: (args: Reserve) =>
            calculateSellPrice(instance, args),
          calculateBuyPrice: (args: Reserve) =>
            calculateBuyPrice(instance, args),
          calculateRewardsAmount: (args: Rewards) =>
            calculateRewardsAmount(instance, args),
          getNodeVersion: () => getNodeVersion(instance),
          getNodeName: () => getNodeName(instance),
          getChain: () => getChain(instance)
        },
        xyk: {
          deactivateLiquidity: (args: Liquidity) =>
            deactivateLiquidity(instance, args, false),
          activateLiquidity: (args: Liquidity) =>
            activateLiquidity(instance, args, false),
          burnLiquidity: (args: BurnLiquidity) =>
            burnLiquidity(instance, args, false),
          mintLiquidity: (args: MintLiquidity) =>
            mintLiquidity(instance, args, false),
          buyAsset: (args: BuyAsset) => buyAsset(instance, args, false),
          sellAsset: (args: SellAsset) => sellAsset(instance, args, false),
          createPool: (args: CreatePool) => createPool(instance, args, false),
          claimRewards: (args: Liquidity) => claimRewards(instance, args, false)
        },
        submitableExtrinsic: {
          createPool: (args: CreatePool) => createPool(instance, args, true),
          claimRewards: (args: Liquidity) => claimRewards(instance, args, true),
          sellAsset: (args: SellAsset) => sellAsset(instance, args, true),
          buyAsset: (args: BuyAsset) => buyAsset(instance, args, true),
          mintLiquidity: (args: MintLiquidity) =>
            mintLiquidity(instance, args, true),
          burnLiquidity: (args: BurnLiquidity) =>
            burnLiquidity(instance, args, true),
          activateLiquidity: (args: Liquidity) =>
            activateLiquidity(instance, args, true),
          deactivateLiquidity: (args: Liquidity) =>
            deactivateLiquidity(instance, args, true),
          transferAllTokens: (args: Transfer) =>
            transferAllTokens(instance, args, true),
          transferTokens: (args: Transfer & { amount: Amount }) =>
            transferTokens(instance, args, true)
        },
        tokens: {
          transferAllTokens: (args: Transfer) =>
            transferAllTokens(instance, args, false),
          transferTokens: (args: Transfer & { amount: Amount }) =>
            transferTokens(instance, args, false)
        },
        xTokens: {
          deposit: (args: Deposit) => deposit(args),
          depositKsm: (args: RelayDeposit) => depositKsm(args),
          withdraw: (args: Withdraw) => withdraw(instance, args),
          withdrawKsm: (args: RelayWithdraw) => withdrawKsm(instance, args)
        }
      };
    }
  };
})();
