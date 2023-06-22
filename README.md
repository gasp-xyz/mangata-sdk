<h2 align="center">Mangata Finance SDK</h2>

<p align="center">
    Mangata SDK is a toolset for convenient communication with Mangata Substrate node.
</p>

![Artwork](https://blog.mangata.finance/assets/posts/themis-cover.png)

![npm](https://img.shields.io/npm/v/%40mangata-finance%2Fsdk)
![Issues](https://img.shields.io/github/issues/mangata-finance/mangata-sdk)
![Pull Request](https://img.shields.io/github/issues-pr/mangata-finance/mangata-sdk)
![GitHub last commit](https://img.shields.io/github/last-commit/mangata-finance/mangata-sdk)
![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fmangata-finance%2Fmangata-sdk%2Fbadge%3Fref%3Ddevelop&style=flat)
![npm type definitions](https://img.shields.io/npm/types/%40mangata-finance%2Fsdk)

# Getting Started

Mangata SDK is a first library, built in typescript that provides easy methods for buying and selling assets on Mangata DEX. The main purpose is to save time for builders of client applications, primarily for algorithmic traders and frontend interface builders.

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

```js
V1:
const mangata = Mangata.getInstance(["wss://kusama-archive.mangata.online"]);

V2:
import { MangataInstance } from "@mangata-finance/sdk"
const mangata: MangataInstance = Mangata.instance(["wss://kusama-archive.mangata.online"]);
```

```js
V1:
const mangata = Mangata.getInstance(["wss://kusama-archive.mangata.online"]);
const amount = await mangata.getAmountOfTokenIdInPool("0", "4")

V2:
import { MangataInstance } from "@mangata-finance/sdk"
const mangata: MangataInstance = Mangata.instance(["wss://kusama-archive.mangata.online"]);
const amount = await mangata.query.getAmountOfTokensInPool("0", "4")
```

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
