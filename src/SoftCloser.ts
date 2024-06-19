// import { ethers } from "hardhat";
import type { JsonRpcProvider, TransactionRequest } from "ethers";
import { EthereumProvider } from "hardhat/types";

export class SoftCloser {
  private sourceProvider: JsonRpcProvider;
  private _sourceBlockNumber: number;
  private txNumberLimit: number;

  get sourceBlockNumber(): number {
    return this._sourceBlockNumber;
  }

  constructor(
    sourceProvider: JsonRpcProvider,
    sourceBlockNumber: number,
    txNumberLimit: number,
  ) {
    this.sourceProvider = sourceProvider;
    this._sourceBlockNumber = sourceBlockNumber;
    this.txNumberLimit = txNumberLimit;
  }

  private numbersUpTo(n: number) {
    return Array.from({ length: n }, (_, i) => i);
  }

  private async getBlockTransactions(
    provider: JsonRpcProvider,
    blockNumber: number,
  ) {
    const block = await provider.getBlock(blockNumber, true);
    return block?.transactions;
  }

  /**
   * Duplicates certain number of transactions from a given block
   * @param blockNumber Block number to duplicate transactions from (default: source block number provided in config)
   * @param txNumberLimit Number of transactions to duplicate (default: number provided in config or 0)
   */
  public async duplicateTransactions(
    blockNumber = this._sourceBlockNumber,
    txNumberLimit = this.txNumberLimit,
  ): Promise<void> {
    if (txNumberLimit === 0) {
      console.log("No transactions to duplicate");
      return;
    }
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
