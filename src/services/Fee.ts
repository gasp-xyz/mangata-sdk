import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { BN } from "@polkadot/util";

import { fromBN } from "../utils/BNutility";

export class Fee {
  static async activateLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .activateLiquidity(liquditityTokenId, amount)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async deactivateLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .deactivateLiquidity(liquditityTokenId, amount)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async claimRewardsFee(
    api: ApiPromise,
    account: string | KeyringPair,
    liquidityTokenId: string,
    amount: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .claimRewards(liquidityTokenId, amount)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async createPoolFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .createPool(
        firstTokenId,
        firstTokenAmount,
        secondTokenId,
        secondTokenAmount
      )
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async sellAssetFee(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    minAmountOut: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async buyAssetFee(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    maxAmountIn: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async mintLiquidityFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN = new BN(Number.MAX_SAFE_INTEGER)
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .mintLiquidity(
        firstTokenId,
        secondTokenId,
        firstTokenAmount,
        expectedSecondTokenAmount
      )
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async burnLiquidityFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .burnLiquidity(firstTokenId, secondTokenId, liquidityTokenAmount)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async transferTokenFee(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN
  ): Promise<string> {
    const dispatchInfo = await api.tx.tokens
      .transfer(address, tokenId, amount)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }

  static async transferAllTokenFee(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string
  ): Promise<string> {
    const dispatchInfo = await api.tx.tokens
      .transferAll(address, tokenId, true)
      .paymentInfo(account);
    return fromBN(new BN(dispatchInfo.partialFee.toString()));
  }
}
