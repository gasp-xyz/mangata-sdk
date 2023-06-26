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

# Migration from v1 to v2

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

```

```
