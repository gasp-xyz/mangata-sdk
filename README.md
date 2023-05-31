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

# Basic use case

Here is a quick example to get you started, **all you need is Mangata instance**:

```js
const { Mangata } = require("@mangata-finance/sdk");

async function main() {
  // Connect to the mainet (also testnet, mainnet)
  const mangata = Mangata.instance([
    "wss://mangata-x.api.onfinality.io/public-ws"
  ]);

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
