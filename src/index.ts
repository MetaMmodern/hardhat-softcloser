import "@nomicfoundation/hardhat-ethers";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { subtask } from "hardhat/config";

import "./extends";
import "./type-extensions";

subtask(TASK_NODE_SERVER_READY).setAction(async (args, hre, runSuper) => {
  runSuper(args);
  if (hre.network.name !== "hardhat") {
    return hre.network.provider;
  }
  if (
    hre.config.networks[hre.network.name].forking?.softcloser?.enabled === false
  ) {
    return hre.network.provider;
  }

  try {
    await hre.softcloser.duplicateTransactions();
  } catch (error) {
    console.error("Error while duplicating transactions", error);
  }
  return hre.network.provider;
});
