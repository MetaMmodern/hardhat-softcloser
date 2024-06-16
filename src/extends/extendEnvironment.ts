import { JsonRpcProvider } from "ethers";
import { extendEnvironment } from "hardhat/config";

import { SoftCloser } from "../SoftCloser";
import { isHardhatNetworkUserConfig } from "../utils";

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
