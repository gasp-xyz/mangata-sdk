import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { BN } from '@polkadot/util'
import { TxOptions } from '../types/TxOptions'
import { fromBN } from '../utils/toBn'

class Fee {
  static async createPoolFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .createPool(firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }

  static async sellAssetFee(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }

  static async buyAssetFee(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }

  static async mintLiquidityFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN = new BN(Number.MAX_SAFE_INTEGER),
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .mintLiquidity(firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }

  static async burnLiquidityFee(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.xyk
      .burnLiquidity(firstTokenId, secondTokenId, liquidityTokenAmount)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }

  static async transferTokenFee(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.tokens
      .transfer(address, tokenId, amount)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }

  static async transferAllTokenFee(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    txOptions?: TxOptions
  ): Promise<string> {
    const dispatchInfo = await api.tx.tokens
      .transferAll(address, tokenId, true)
      .paymentInfo(account, { nonce: txOptions?.nonce, signer: txOptions?.signer })
    return fromBN(new BN(dispatchInfo.partialFee.toString()))
  }
}

export default Fee
