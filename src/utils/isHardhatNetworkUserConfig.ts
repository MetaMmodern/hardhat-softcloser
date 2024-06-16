import { HardhatNetworkUserConfig, NetworkUserConfig } from "hardhat/types";

export function isHardhatNetworkUserConfig(
  config: NetworkUserConfig,
): config is HardhatNetworkUserConfig {
  return (config as HardhatNetworkUserConfig).forking !== undefined;
}
