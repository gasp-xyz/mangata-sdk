<h2 align="center">Mangata Finance SDK</h2>

<p align="center">
    The Mangata SDK is a comprehensive toolset designed for facilitating seamless communication with the Mangata Substrate node.
</p>

![Artwork](https://blog.mangata.finance/assets/posts/themis-cover.png)

![npm](https://img.shields.io/npm/v/%40mangata-finance%2Fsdk)
![Issues](https://img.shields.io/github/issues/mangata-finance/mangata-sdk)
![Pull Request](https://img.shields.io/github/issues-pr/mangata-finance/mangata-sdk)
![GitHub last commit](https://img.shields.io/github/last-commit/mangata-finance/mangata-sdk)
![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fmangata-finance%2Fmangata-sdk%2Fbadge%3Fref%3Ddevelop&style=flat)
![npm type definitions](https://img.shields.io/npm/types/%40mangata-finance%2Fsdk)

# Getting Started

The Mangata SDK is the TypeScript library that offers a wide range of convenient methods for effortlessly buying and selling assets on the Mangata DEX. Its primary objective is to streamline the development process for client applications, specifically targeting algorithmic traders and frontend interface builders. By utilizing the Mangata SDK, developers can significantly reduce time and effort required to integrate with the platform.

## Installation

```sh
// with npm
npm i @mangata-finance/sdk

// with yarn
yarn add @mangata-finance/sdk
```

## Migration from v1 to v2

To migrate from v1 to v2, certain modifications need to be made. This guide aims to help you refactor your codebase. We have divided the methods into specific groups:

1. xTokens
2. xyk
3. rpc
4. tokens
5. submitableExtrinsic
6. query
7. fee
8. util

The **buyAsset** and **sellAsset** methods have been removed and replaced by **multiswapBuyAsset** and **multiswapSellAsset** respectively.

We also made a change by transitioning from using arguments for functions to using objects as parameters.
Example:

```js
V1:
await instance.createPool(
    testUser,
    firstTokenId,
    new BN("10000000000000000000000"),
    secondTokenId,
    new BN("10000000000000000000000"),
    txOptions: {
      extrinsicStatus: (data) => {
        console.log(data)
      }
    }
  );


V2:
const args: CreatePool = {
    account: testUser,
    firstTokenId: firstTokenId!,
    secondTokenId: secondTokenId!,
    firstTokenAmount: new BN("10000000000000000000000"),
    secondTokenAmount: new BN("10000000000000000000000"),
    txOptions: {
      extrinsicStatus: (data) => {
        console.log(data)
      }
    }
  };
  await instance.xyk.createPool(args);
```

We no longer support the implementation of depositing to Mangata within the SDK. However, we do provide the necessary raw methods for depositing, which should be implemented separately outside of the SDK. For specific examples of how to deposit to Mangata using the SDK, please refer to the provided examples.

To obtain an instance of the Mangata node, please follow this step:

```js
V1:
const mangata = Mangata.getInstance(["wss://kusama-archive.mangata.online"]);

V2:
import { MangataInstance } from "@mangata-finance/sdk"
const mangata: MangataInstance = Mangata.instance(["wss://kusama-archive.mangata.online"]);
```

Method **getAmountOfTokenIdInPool** has been renamed to **getAmountOfTokensInPool**

```js
V1:
const amount = await mangata.getAmountOfTokenIdInPool("0", "4")

V2:
const amount = await mangata.query.getAmountOfTokensInPool("0", "4")
```

Please replace the existing "buyAsset" and "sellAsset" methods with the newly introduced "multiswapBuyAsset" and "multiswapSellAsset" methods.

```js
V1:
await mangata.buyAsset(
    account: string | KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  )

V2:
const args: MultiswapBuyAsset = {
    account: Account;
    tokenIds: TokenId[];
    amount: TokenAmount;
    maxAmountIn: TokenAmount;
    txOptions?: Partial<TxOptions> | undefined;
}
await mangata.xyk.multiswapBuyAsset(args)
```

To illustrate how to retrieve asset information, you need to determine its corresponding section within the SDK. The method **getAssetInfo** is located within the query block.

```js
V1:
const assetInfo = await mangata.getAssetInfo()

V2:
const assetInfo = await mangata.query.getAssetInfo()
```

# Basic use case

Here is a quick example to get you started, **all you need is Mangata instance**:

Support: Only ESM

```js
import { Mangata } from "@mangata-finance/sdk";

async function main() {
  // Connect to the mainet (also testnet, mainnet)
  const mangata = Mangata.instance(["wss://kusama-archive.mangata.online"]);

  // Retrieve the chainName, nodeName & nodeVersion information
  const [chain, nodeName, nodeVersion] = await Promise.all([
    mangata.rpc.getChain(),
    mangata.rpc.getNodeName(),
    mangata.rpc.getNodeVersion()
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );
}

main()
  .catch(console.error)
  .finally(() => process.exit());
```

For available methods please visit [docs](https://docs.mangata.finance/sdk/)

# Documentation

```js
import {
  Mangata,
  MangataInstance,
  MainTokens,
  PoolWithShare,
  TokenId,
  Token,
  PoolWithRatio,
  TokenBalance,
  TokenInfo
} from "../";
import { BN } from "@polkadot/util";

const ENDPOINT = "wss://kusama-archive.mangata.online";
const KSM_TOKEN = "4";
const MGX_TOKEN = "0";
const ADDRESS = "5CP5sgWw94GoQCGvm4qeNgKTw41Scnk2F41uPe4SSAPVPoCU";
const LPTOKENKSMANDMGX = "5";

const main = async () => {
  const mangata: MangataInstance = Mangata.instance([ENDPOINT]);
  /**
   * Retrieves the amount of tokens in a liquidity pool for a given pair of
   * tokens.
   * @param {string} firstTokenId
   * @param {string} secondTokenId
   *
   * @returns {BN | Array}
   */

  const amountOfTokens: BN[] = await mangata.query.getAmountOfTokensInPool(
    KSM_TOKEN,
    MGX_TOKEN
  );

  /**
   * Retrieves information about the assets.
   *
   * @returns {MainTokens}
   */
  const assetInfo: MainTokens = await mangata.query.getAssetsInfo();

  /**
   * Retrieves the current block number.
   *
   * @returns {string}
   */
  const blockNumber: string = await mangata.query.getBlockNumber();

  /**
   * Retrieves the pools in which the specified address has invested
   *
   * @returns {PoolWithShare | Array}
   */

  const investedPools: PoolWithShare[] = await mangata.query.getInvestedPools(
    ADDRESS
  );

  /**
   * Retrieves the liquidity pool information for a specific liquidity token * ID.
   *
   * @returns {TokenId | Array}
   */

  const liquidityPool: TokenId[] = await mangata.query.getLiquidityPool(
    LPTOKENKSMANDMGX
  );

  /**
   * Retrieves the liquidity token ID for a given pair of tokens.
   *
   * @returns {TokenId}
   */
  const liquidityTokenId: TokenId = await mangata.query.getLiquidityTokenId(
    KSM_TOKEN,
    MGX_TOKEN
  );

  /**
   * Retrieves the liquidity token IDs.
   *
   * @returns {TokenId | Array}
   */
  const liquidityTokenIds: TokenId[] =
    await mangata.query.getLiquidityTokenIds();

  /**
   * Retrieves the liquidity tokens.
   *
   * @returns {MainTokens}
   */
  const liquidityTokens: MainTokens = await mangata.query.getLiquidityTokens();

  /**
   * Retrieves the nonce of the specified address.
   *
   * @returns {BN}
   */
  const nonce: BN = await mangata.query.getNonce(ADDRESS);

  /**
   * Retrieves the tokens owned by a specific address.
   *
   * @returns {[id: TokenId]: Token}}
   */
  const ownedTokens: {
    [id: TokenId]: Token
  } = await mangata.query.getOwnedTokens(ADDRESS);

  /**
   * Retrieves the detailed information about a specific pool.
   *
   * @returns {PoolWithRatio}
   */
  const pool: PoolWithRatio = await mangata.query.getPool(LPTOKENKSMANDMGX);

  /**
   * Retrieves information about all the available pools.
   *
   * @returns {PoolWithRatio | Array}
   */
  const pools: PoolWithRatio[] = await mangata.query.getPools();

  /**
   * Retrieves the token balance for a specific address and token ID.
   *
   * @returns {TokenBalance}
   */
  const tokenBalance: TokenBalance = await mangata.query.getTokenBalance(
    MGX_TOKEN,
    ADDRESS
  );

  /**
   * Retrieves detailed information about a specific token.
   *
   * @returns {TokenInfo}
   */
  const tokenInfo: TokenInfo = await mangata.query.getTokenInfo(MGX_TOKEN);

  /**
   * Retrieves the total issuance of a specific token.
   *
   * @returns {BN}
   */
  const issuance: BN = await mangata.query.getTotalIssuance(MGX_TOKEN);

  /**
   * Retrieves the total issuance of all tokens.
   *
   * @returns {Record<string, BN>}
   */
  const totalIssuanceOfTokens: Record<string, BN> =
    await mangata.query.getTotalIssuanceOfTokens();

  /**
   * Calculates the buy price based on the reserve parameters
   *
   * @returns {BN}
   */
  const argsReserve: Reserve = {
    inputReserve: new BN("1000000000000000000"),
    outputReserve: new BN("10000000000000000000"),
    amount: new BN("10000")
  };
  const price: BN = await mangata.rpc.calculateBuyPrice(argsReserve);

  /**
   * Calculates the buy price based on the asset's ID.
   *
   * @returns {BN}
   */
  const price: BN = await mangata.rpc.calculateBuyPriceId(
    KSM_TOKEN,
    MGX_TOKEN,
    new BN("10000")
  );

  /**
   * Calculates the rewards amount based on the rewards parameters.
   *
   * @returns {BN}
   */
  const argsRewards: Rewards = {
    address: ADDRESS,
    liquidityTokenId: LPTOKENKSMANDMGX
  };
  const rewards: BN = await mangata.rpc.calculateRewardsAmount(argsRewards);

  /**
   * Calculates the sell price based on the reserve parameters.
   *
   * @returns {BN}
   */
  const argsReserve: Reserve = {
    inputReserve: new BN("1000000000000000000"),
    outputReserve: new BN("10000000000000000000"),
    amount: new BN("10000")
  };
  const price: BN = await mangata.rpc.calculateSellPrice(argsReserve);

  /**
   * Calculates the sell price based on the asset's ID.
   *
   * @returns {BN}
   */
  const price: BN = await mangata.rpc.calculateSellPriceId(
    KSM_TOKEN,
    MGX_TOKEN,
    new BN("10000")
  );
};

main()
  .catch(console.error)
  .finally(() => process.exit());
```

# Transactions

```js
import {
  Mangata,
  MangataInstance
  TransferTokens,
  MangataGenericEvent,
  MangataGenericEvent,
  MultiswapBuyAsset,
  Batch,
  MintLiquidity
} from "@mangata-finance/sdk";
import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { v4 as uuidv4 } from "uuid";
import { ISubmittableResult } from "@polkadot/types/types";
const mangata: MangataInstance = Mangata.instance([ENDPOINT]);

const keyring = new Keyring({ type: "sr25519" });
const testUser = "//testUser_" + uuidv4();
const account = keyring.createFromUri(testUser);
keyring.addPair(account);

const args: TransferTokens = {
  account: account,
  tokenId: MGX_TOKEN,
  address: ADDRESS,
  amount: new BN(100e18), // 100 MGX
  txOptions: {
    statusCallback: (status: ISubmittableResult) => {
      // Here you can check for status of your transaction
      console.log(status);
    },
    extrinsicStatus: (result: MangataGenericEvent[]) => {
      // here will be the result of your transaction
      console.log(result);
    }
  }
};
await mangata.tokens.transferTokens(args);

const args: MultiswapBuyAsset = {
    account,
    tokenIds: [MGX_TOKEN, KSM_TOKEN],
    amount: new BN(1000e18), // 100 MGX
    maxAmountIn: new BN(60000e18),
    txOptions: {
      statusCallback: (status: ISubmittableResult) => {
        // Here you can check for status of your transaction
        console.log(status);
      },
      extrinsicStatus: (result: MangataGenericEvent[]) => {
        // here will be the result of your transaction
        console.log(result);
      }
    }
  };
  await mangata.xyk.multiswapBuyAsset(args);

  const argsBuy: MultiswapBuyAsset = {
    account,
    tokenIds: [MGX_TOKEN, KSM_TOKEN],
    amount: new BN(1000e18), // 100 MGX
    maxAmountIn: new BN(60000e18)
  };
  const tx1 = await mangata.submitableExtrinsic.multiswapBuyAsset(argsBuy);

  const argsMint: MintLiquidity = {
    account,
    firstTokenId: KSM_TOKEN,
    secondTokenId: MGX_TOKEN,
    firstTokenAmount: new BN(100e12),
    expectedSecondTokenAmount: new BN(1000e18)
  };

  const tx2 = await mangata.submitableExtrinsic.mintLiquidity(argsMint);

  const args: Batch = {
    account,
    calls: [tx1, tx2],
    txOptions: {
      statusCallback: (status: ISubmittableResult) => {
        // Here you can check for status of your transaction
        console.log(status);
      },
      extrinsicStatus: (result: MangataGenericEvent[]) => {
        // here will be the result of your transaction
        console.log(result);
      }
    }
  };
  await mangata.batch(args);
```
