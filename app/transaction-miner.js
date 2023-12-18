class TransactionMiner{
  constructor({blockchain, transactionPool, wallet, pubsub}){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  };

  mineTransactions(){
    // get valid transactions from transaction pool

    // generate reward transaction

    // add block to the blockchain

    // broadcast the uodated blockchain

    // clear the pool
  }
};

module.exports = TransactionMiner;