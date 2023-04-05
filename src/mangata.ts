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
import { Address, MangataInstance, TokenAmount, TokenId } from "./types/common";
import { mintLiquidity } from "./methods/xyk/mintLiquidity";
import { deposit } from "./methods/xTokens/deposit";
import {
  Deposit,
  DepositStatemine,
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
import { batchAll } from "./methods/utility/batchAll";
import { forceBatch } from "./methods/utility/forceBatch";
import { getOrCreateInstance } from "./utils/getOrCreateInstance";
import { waitForNewBlock } from "./methods/rpc/waitForNewBlock";
import { depositStatemineTokens } from "./methods/xTokens/depositStatemineTokens";

function createMangataInstance(urls: string[]): MangataInstance {
  const instancePromise = getOrCreateInstance(urls);

  return {
    apiPromise: instancePromise,
    batch: async (args: Batch) => await batch(instancePromise, args),
    batchAll: async (args: Batch) => await batchAll(instancePromise, args),
    forceBatch: async (args: Batch) => await forceBatch(instancePromise, args),
    xTokens: {
      deposit: async (args: Deposit) => await deposit(args),
      depositKsm: async (args: RelayDeposit) => await depositKsm(args),
      depositStatemineTokens: async (args: DepositStatemine) =>
        await depositStatemineTokens(args),
      withdraw: async (args: Withdraw) => await withdraw(instancePromise, args),
      withdrawKsm: async (args: RelayWithdraw) =>
        await withdrawKsm(instancePromise, args)
    },
    xyk: {
      deactivateLiquidity: async (args: Liquidity) =>
        await deactivateLiquidity(instancePromise, args, false),
      activateLiquidity: async (args: Liquidity) =>
        await activateLiquidity(instancePromise, args, false),
      burnLiquidity: async (args: BurnLiquidity) =>
        await burnLiquidity(instancePromise, args, false),
      mintLiquidity: async (args: MintLiquidity) =>
        await mintLiquidity(instancePromise, args, false),
      buyAsset: async (args: BuyAsset) =>
        await buyAsset(instancePromise, args, false),
      sellAsset: async (args: SellAsset) =>
        await sellAsset(instancePromise, args, false),
      createPool: async (args: CreatePool) =>
        await createPool(instancePromise, args, false),
      claimRewards: async (args: Liquidity) =>
        await claimRewards(instancePromise, args, false)
    },
    rpc: {
      calculateBuyPriceId: async (args: Price) =>
        await calculateBuyPriceId(instancePromise, args),
      calculateSellPriceId: async (args: Price) =>
        await calculateSellPriceId(instancePromise, args),
      getBurnAmount: async (args: Price) =>
        await getBurnAmount(instancePromise, args),
      calculateSellPrice: async (args: Reserve) =>
        await calculateSellPrice(instancePromise, args),
      calculateBuyPrice: async (args: Reserve) =>
        await calculateBuyPrice(instancePromise, args),
      calculateRewardsAmount: async (args: Rewards) =>
        await calculateRewardsAmount(instancePromise, args),
      getNodeVersion: async () => await getNodeVersion(instancePromise),
      getNodeName: async () => await getNodeName(instancePromise),
      getChain: async () => await getChain(instancePromise),
      waitForNewBlock: async (blockNumber?: number) =>
        await waitForNewBlock(instancePromise, blockNumber)
    },
    tokens: {
      transferAllTokens: async (args: Transfer) =>
        await transferAllTokens(instancePromise, args, false),
      transferTokens: async (args: Transfer & { amount: TokenAmount }) =>
        await transferTokens(instancePromise, args, false)
    },
    submitableExtrinsic: {
      createPool: async (args: CreatePool) =>
        await createPool(instancePromise, args, true),
      claimRewards: async (args: Liquidity) =>
        await claimRewards(instancePromise, args, true),
      sellAsset: async (args: SellAsset) =>
        await sellAsset(instancePromise, args, true),
      buyAsset: async (args: BuyAsset) =>
        await buyAsset(instancePromise, args, true),
      mintLiquidity: async (args: MintLiquidity) =>
        await mintLiquidity(instancePromise, args, true),
      burnLiquidity: async (args: BurnLiquidity) =>
        await burnLiquidity(instancePromise, args, true),
      activateLiquidity: async (args: Liquidity) =>
        await activateLiquidity(instancePromise, args, true),
      deactivateLiquidity: async (args: Liquidity) =>
        await deactivateLiquidity(instancePromise, args, true),
      transferAllTokens: async (args: Transfer) =>
        await transferAllTokens(instancePromise, args, true),
      transferTokens: async (args: Transfer & { amount: TokenAmount }) =>
        await transferTokens(instancePromise, args, true)
    },
    query: {
      getNonce: async (address: Address) =>
        await getNonce(instancePromise, address),
      getLiquidityTokenId: async (
        firstTokenId: TokenId,
        secondTokenId: TokenId
      ) =>
        await getLiquidityTokenId(instancePromise, firstTokenId, secondTokenId),
      getTotalIssuance: async (tokenId: TokenId) =>
        await getTotalIssuance(instancePromise, tokenId),
      getTokenBalance: async (address: Address, tokenId: TokenId) =>
        await getTokenBalance(instancePromise, address, tokenId),
      getTokenInfo: async (tokenId: TokenId) =>
        await getTokenInfo(instancePromise, tokenId),
      getLiquidityTokenIds: async () =>
        await getLiquidityTokenIds(instancePromise),
      getLiquidityTokens: async () => await getLiquidityTokens(instancePromise),
      getBlockNumber: async () => await getBlockNumber(instancePromise),
      getOwnedTokens: async (address: Address) =>
        await getOwnedTokens(instancePromise, address),
      getAssetsInfo: async () => await getAssetsInfo(instancePromise),
      getInvestedPools: async (address: Address) =>
        await getInvestedPools(instancePromise, address),
      getAmountOfTokenIdInPool: async (
        firstTokenId: TokenId,
        secondTokenId: TokenId
      ) =>
        await getAmountOfTokenIdInPool(
          instancePromise,
          firstTokenId,
          secondTokenId
        ),
      getLiquidityPool: async (liquidityTokenId: TokenId) =>
        await getLiquidityPool(instancePromise, liquidityTokenId),
      getPool: async (liquidityTokenId: TokenId) =>
        await getPool(instancePromise, liquidityTokenId),
      getPools: async () => await getPools(instancePromise),
      getTotalIssuanceOfTokens: async () =>
        await getTotalIssuanceOfTokens(instancePromise)
    },
    fee: {
      withdraw: async (args: WithdrawFee) =>
        await forWithdraw(instancePromise, args),
      activateLiquidity: async (args: ActivateLiquidityFee) =>
        await forActivateLiquidity(instancePromise, args),
      deactivateLiquidity: async (args: DeactivateLiquidityFee) =>
        await forDeactivateLiquidity(instancePromise, args),
      claimRewards: async (args: ClaimRewardsFee) =>
        await forClaimRewards(instancePromise, args),
      createPool: async (args: CreatePoolFee) =>
        await forCreatePool(instancePromise, args),
      sellAsset: async (args: SellAssetFee) =>
        await forSellAsset(instancePromise, args),
      buyAsset: async (args: BuyAssetFee) =>
        await forBuyAsset(instancePromise, args),
      mintLiquidity: async (args: MintLiquidityFee) =>
        await forMintLiquidity(instancePromise, args),
      burnLiquidity: async (args: BurnLiquidityFee) =>
        await forBurnLiquidity(instancePromise, args),
      transferAllToken: async (args: TransferAllFee) =>
        await forTransferAllToken(instancePromise, args),
      transferToken: async (args: TransferTokenFee) =>
        await forTransferToken(instancePromise, args)
    }
  };
}

const Mangata = {
  instance: createMangataInstance
};

export { Mangata };
