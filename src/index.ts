import "@nomicfoundation/hardhat-ethers";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { subtask } from "hardhat/config";

import "./extends";
import "./type-extensions";

subtask(TASK_NODE_SERVER_READY).setAction(async (args, hre, runSuper) => {
  console.log("I'm running");
  runSuper(args);
  if (
    hre.network.name === "hardhat" &&
    hre.config.networks[hre.network.name].forking?.softcloser?.enabled === false
  ) {
    return hre.network.provider;
  }
  await hre.softcloser.duplicateTransactions();
  return hre.network.provider;
});
