// import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
// import { extendConfig, extendEnvironment, subtask } from "hardhat/config";
// import {
//   HardhatConfig,
//   HardhatNetworkUserConfig,
//   HardhatUserConfig,
//   NetworkUserConfig,
// } from "hardhat/types";
import type { SoftCloser } from "./SoftCloser";

class ExampleHardhatRuntimeEnvironmentField {}

type SoftCloserUserConfig = {
  numberOfTransactions?: number;
  enabled?: boolean;
};

export type SoftCloserConfig = {
  numberOfTransactions: number;
  enabled: boolean;
};

declare module "hardhat/types/config" {
  export interface HardhatNetworkForkingUserConfig {
    softcloser?: SoftCloserUserConfig;
  }

  export interface HardhatNetworkForkingConfig {
    softcloser: SoftCloserConfig;
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    softcloser: SoftCloser;
  }
}
