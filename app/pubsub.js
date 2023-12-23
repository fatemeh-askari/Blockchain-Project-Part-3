const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
} 



class PubSub {
  constructor({blockchain, transactionPool}){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();


    // this.subscriber.subscribe(CHANNELS.TEST);
    // this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(channel, message);
    })
  }

  subscribeToChannels(){
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    })
  }

  publish({channel, message}){
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      });
    })
  }

  broadcastChain(){
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    })
  }

  broadcastTransaction(transaction){
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    })
  }

  handleMessage(channel, message){
    const parsedMessage = JSON.parse(message)
    // if (channel === CHANNELS.BLOCKCHAIN) {
    //   this.blockchain.replaceChain(parsedMessage)
    // }
    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({
            chai: parsedMessage
          });
        });
        break;
      
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
    
      default:
        break;
    }
  }
}


// const testPubSub = new PubSub();

// setTimeout(() => {
//   testPubSub.publisher.publish(CHANNELS.TEST, 'foo');
// }, 1000)


module.exports = PubSub;




