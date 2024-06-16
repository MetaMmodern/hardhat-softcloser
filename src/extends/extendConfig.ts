import { extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import { SoftCloserConfig } from "../type-extensions";

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
    const userNetwork = userConfig.networks?.["hardhat"];

    if (!userNetwork) {
      return;
      // not good probably, gotta do some default stuff
    }

    if (!userNetwork.forking) {
      return;
    }
    if (!config.networks["hardhat"].forking) {
      return;
    }

    const usersoftcloser = userNetwork.forking?.softcloser;

    const newsoftcloser: SoftCloserConfig = {
      numberOfTransactions: usersoftcloser?.numberOfTransactions ?? 0,
      enabled: usersoftcloser?.enabled ?? false,
    };

    config.networks["hardhat"].forking.softcloser = newsoftcloser;
  },
);
