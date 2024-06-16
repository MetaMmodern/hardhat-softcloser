import "@nomicfoundation/hardhat-ethers";
import { JsonRpcProvider } from "ethers";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { extendConfig, extendEnvironment, subtask } from "hardhat/config";
import {
  HardhatConfig,
  HardhatNetworkUserConfig,
  HardhatUserConfig,
  NetworkUserConfig,
} from "hardhat/types";

import { SoftCloser } from "./SoftCloser";
import "./type-extensions";

function isHardhatNetworkUserConfig(
  config: NetworkUserConfig,
): config is HardhatNetworkUserConfig {
  return (config as HardhatNetworkUserConfig).forking !== undefined;
}
extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // We apply our default config here. Any other kind of config resolution
    // or normalization should be placed here.
    //
    // `config` is the resolved config, which will be used during runtime and
    // you should modify.
    // `userConfig` is the config as provided by the user. You should not modify
    // it.
    //
    // If you extended the `HardhatConfig` type, you need to make sure that
    // executing this function ensures that the `config` object is in a valid
    // state for its type, including its extensions. For example, you may
    // need to apply a default value, like in this example.
    const userNetworks = userConfig.networks;

    for (const network in userNetworks) {
      if (Object.prototype.hasOwnProperty.call(userNetworks, network)) {
        const userNetwork = userNetworks[network];
        if (!userNetwork || !isHardhatNetworkUserConfig(userNetwork)) {
          return;
        }
        if (!userNetwork.forking) {
          return;
        }

        const usersoftcloser = userNetwork.forking?.softcloser;

        let newsoftcloser: {};
        if (usersoftcloser === undefined) {
          newsoftcloser = {};
        } else {
          newsoftcloser = usersoftcloser;
        }
        userNetwork.forking.softcloser = newsoftcloser;
      }
    }
  },
);

extendEnvironment((hre) => {
  console.log("I;m extending heheheh");
  const config = hre.userConfig;
  const networkName = hre.network.name;

  const networkUserConfigByNetworkName =
    !!config.networks && config.networks[networkName];
  if (
    !networkUserConfigByNetworkName ||
    !isHardhatNetworkUserConfig(networkUserConfigByNetworkName)
  ) {
    console.warn(
      `No network config found for network "${networkName}" or network config is not a HardhatNetworkUserConfig.`,
    );
    return;
  }

  if (
    !networkUserConfigByNetworkName.forking?.url ||
    !networkUserConfigByNetworkName.forking?.enabled
  ) {
    console.warn(
      `Forking is not enabled for network "${networkName}" or no URL provided.`,
    );
    return;
  }

  const srcProvider = new JsonRpcProvider(
    networkUserConfigByNetworkName.forking?.url,
  );

  hre.softcloser = new SoftCloser(
    srcProvider,
    (networkUserConfigByNetworkName.forking?.blockNumber ?? 0) + 1,
    networkUserConfigByNetworkName.forking?.softcloser?.numberOfTransactions ??
      0,
  );
  console.log("Softcloser initialized");
  console.log(hre.softcloser);
});

subtask(TASK_NODE_SERVER_READY).setAction(async (args, hre, runSuper) => {
  console.log("I'm running");
  runSuper(args);
  await hre.softcloser.duplicateTransactions();
  return hre.network.provider;
});
