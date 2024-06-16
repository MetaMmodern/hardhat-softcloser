// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.7.3",
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

export default config;
