<p align="center">
    <a href="https://https://mangata.finance/">
    <img width="132" height="101" src="https://mangata.finance/images/logo-without-text.svg" class="attachment-full size-full" alt="Mangata brand" loading="lazy" /></a>
</p>

<h2 align="center">Mangata SDK</h2>

![npm](https://img.shields.io/npm/v/mangata-sdk)
![Issues](https://img.shields.io/github/issues/mangata-finance/mangata-sdk)
![Pull Request](https://img.shields.io/github/issues-pr/mangata-finance/mangata-sdk)
![GitHub last commit](https://img.shields.io/github/last-commit/mangata-finance/mangata-sdk)
![npm type definitions](https://img.shields.io/npm/types/mangata-sdk)


<p align="center">
    Mangata Software Development Kit (SDK) is a toolset for convenient communication with Mangata Substrate node.
</p>


# DO NOT USE. UNDER DEVELOPMENT 

# Getting Started

Mangata SDK is a first library, built in typescript that provides easy methods for buying and selling assets on Mangata DEX. The main purpose is to save time for builders of client applications, primarily for algorithmic traders and frontend interface builders.

## Installation

```sh
// with npm
npm i mangata-sdk

// with yarn
yarn add mangata-sdk
```

# Basic use case

Here is a quick example to get you started, **all you need is Mangata instance**:

```js
const { Mangata } = require('mangata-sdk');

async function main () {
  // Connect to the local node (also testnet, mainnet)
  const mangata = Mangata.getInstance('ws://127.0.0.1:9944')

  // Retrieve the chainName, nodeName & nodeVersion information
  const [chain, nodeName, nodeVersion] = await Promise.all([
    mangata.getChain(),
    mangata.getNodeName(),
    mangata.getNodeVersion()
  ]);

  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  
  // you can also only call one method
  cont chain = await mangata.getChain()
  console.log(`You are connected to chain ${chain}`)
}

main().catch(console.error).finally(() => process.exit());
```

