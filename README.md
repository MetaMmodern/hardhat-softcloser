# hardhat-softcloser

A utility plugin that extends network forking to include transactions from the next block.

[Hardhat](https://hardhat.org) plugin example.

## Motivation

Best way to learn new things is by tryng to replicate what others have done. And when attempting to replicate MEV or Arbitrage transactions from Etherscan I was struggling to get the same results, since the state of my local chain was not the same as the one that I was trying to replicate, even though forking was enabled. After multiple attempts I realised that this was due to the fact that the there were more transactions from unfinished next block before the one I was trying to replicate. So, I wrote a small script to copy preceding transactions from the next block and then it grew into this plugin.

## Installation

<_A step-by-step guide on how to install the plugin_>

```bash
npm install hardhat-softcloser [list of peer dependencies]
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-softcloser");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-softcloser";
```

## Required plugins

<_The list of all the required Hardhat plugins if there are any_>

- [@nomiclabs/hardhat-web3](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-web3)

## Tasks

<_A description of each task added by this plugin. If it just overrides internal
tasks, this may not be needed_>

This plugin creates no additional tasks.

<_or_>

This plugin adds the _example_ task to Hardhat:

```
output of `npx hardhat help example`
```

## Environment extensions

<_A description of each extension to the Hardhat Runtime Environment_>

This plugin extends the Hardhat Runtime Environment by adding a `SoftCloser` field
whose type is `SoftCloser`.

## Configuration

<_A description of each extension to the HardhatConfig or to its fields_>

This plugin extends the `HardhatUserConfig`'s `HardhatNetworkForkingUserConfig` object with an optional
`softCloser` field.

This is an example of how to set it:

```js
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_ENDPOINT ?? "",
        enabled: true,
        blockNumber: 19649498,
        softcloser: {
          numberOfTransactions: 3,
          enabled: true,
        },
      },
    },
  },
};
```

## Usage

<_A description of how to use this plugin. How to use the tasks if there are any, etc._>

There are no additional steps you need to take for this plugin to work.

Install it and access ethers through the Hardhat Runtime Environment anywhere
you need it (tasks, scripts, tests, etc).
