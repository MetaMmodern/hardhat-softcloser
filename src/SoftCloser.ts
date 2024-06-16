// import { ethers } from "hardhat";
import type { JsonRpcProvider, TransactionRequest } from "ethers";
import { EthereumProvider } from "hardhat/types";

export class SoftCloser {
  private sourceProvider: JsonRpcProvider;
  private sourceBlockNumber: number;
  private txNumberLimit: number;

  constructor(
    sourceProvider: JsonRpcProvider,
    sourceBlockNumber: number,
    txNumberLimit: number,
  ) {
    this.sourceProvider = sourceProvider;
    this.sourceBlockNumber = sourceBlockNumber;
    this.txNumberLimit = txNumberLimit;
  }

  private numbersUpTo(n: number) {
    return Array.from({ length: n }, (_, i) => i);
  }

  private async getCurrentBlockNumber(
    provider: JsonRpcProvider,
  ): Promise<number> {
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  }

  private async getBlockTransactions(
    provider: JsonRpcProvider,
    blockNumber: number,
  ) {
    const block = await provider.getBlock(blockNumber, true);
    return block?.transactions;
  }

  public async duplicateTransactions(
    blockNumber = this.sourceBlockNumber,
    txNumberLimit = this.txNumberLimit,
  ): Promise<void> {
    const { ethers } = await import("hardhat"); // TODO: probably inneficient
    console.log(`Duplicating transactions from block ${blockNumber}`);
    console.log(`Requesting ${txNumberLimit} transactions`);
    const transactionIndexes = this.numbersUpTo(txNumberLimit);
    const sourceTransactions = await this.getBlockTransactions(
      this.sourceProvider,
      blockNumber,
    );

    if (!sourceTransactions) {
      throw new Error(
        `No transactions found in block ${blockNumber}, make sure block number is correct`,
      );
    }

    const transactionsToDuplicate = transactionIndexes.map(
      (index) => sourceTransactions[index],
    );

    for (const transaction of transactionsToDuplicate) {
      const originalTx = await this.sourceProvider.getTransaction(transaction);

      if (!originalTx) {
        throw new Error("Transaction not found");
      }
      const tx: TransactionRequest = {
        from: originalTx.from,
        to: originalTx.to,
        value: originalTx.value,
        gasPrice: originalTx.gasPrice,
        gasLimit: originalTx.gasLimit,
        data: originalTx.data,
      };

      const signer = await ethers.getImpersonatedSigner(originalTx.from);

      await signer.sendTransaction(tx);
      console.log(`Transaction ${transaction} duplicated`);
    }
  }
}
