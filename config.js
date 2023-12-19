const INITIAL_DIFFICLTY = 3;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;

const REWARD_INPUT = {address: '*authorized-reward*'};
const MINER_REWARD = 50;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: '-----',
  hash: 'hash-one',
  difficulty: INITIAL_DIFFICLTY,
  nonce: 0,
  data: []
}

module.exports = {GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINER_REWARD}; 