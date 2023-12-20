const Transaction = require('./../wallet/transaction')

class TransactionMiner{
  constructor({blockchain, transactionPool, wallet, pubsub}){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  };

  mineTransactions(){
    // get valid transactions from transaction pool
    const validTransactions = this.transactionPool.validTransactions();

    // generate reward transaction
    validTransactions.push(Transaction.rewardTransaction({minerWallet: this.wallet}));

    // add block to the blockchain
    this.blockchain.addBlock({data: validTransactions});

    // broadcast the uodated blockchain
    this.pubsub.broadcastChain();

    // clear the pool
    this.transactionPool.clear();
  }
};

module.exports = TransactionMiner;