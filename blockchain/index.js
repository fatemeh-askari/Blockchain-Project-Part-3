const Block = require('./block');
const cryptoHash = require('./../util/crypto-hash');

class Blockchain{
  constructor(){
    this.chain = [Block.genesis()];
  }

  addBlock({data}){
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1], data
    });

    this.chain.push(newBlock);
  }

  static isValidChain(chain){
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
      return false;
    }

    for(let i=1; i<chain.length; i++){
      const block = chain[i];
      const actualLastHash = chain[i-1].hash;
      const lastDifficulty = chain[i-1].difficulty;

      // const timestamp = block.timestamp;
      // const lastHash = block.lastHash;
      // const hash = block.hash;
      // const data = block.data;
      // const difficulty = block.difficulty;
      // const nonce = block.nonce;

      const {timestamp, lastHash, hash, difficulty, nonce, data} = block;

      if(lastHash !== actualLastHash) return false;
      if(Math.abs(lastDifficulty - difficulty) > 1) return false;
      if(hash !== cryptoHash(timestamp, lastHash, nonce, difficulty, data)) return false;
    }

    return true;

  }

  replaceChain(chain, onSuccess){
    if(chain.length <= this.chain.length){
      console.error('the incoming chain must be longer');
      return;
    };
      
    if(!Blockchain.isValidChain(chain)){
      console.error('the incoming chain must be valid');
      return;
    };

    if(onSuccess) onSuccess();
    console.log('replacing chain with: ', chain)
    this.chain = chain;
  }
}

module.exports = Blockchain;