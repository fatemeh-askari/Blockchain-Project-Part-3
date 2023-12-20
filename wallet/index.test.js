const Wallet = require('./index');
const {verifySignature} = require('./../util');
const Transaction = require('./transaction');
const Blockchain = require('./../blockchain');
const { STARTING_BALANCE } = require('../config');

describe('Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it('hav a balance', () => {
    expect(wallet).toHaveProperty('balance')
  });

  it('hav a publicKey', () => {
    console.log(wallet.publicKey);
    expect(wallet).toHaveProperty('publicKey')
  });
  

  describe('singing data', () => {
    const data = 'some-data';
    
    it('verifies a signature', () => {
      expect(verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: wallet.sign(data)
      })).toBe(true);
    });

    it('does not verify an invalid signature', () => {
      expect(verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: new Wallet().sign(data)
      })).toBe(false);
    });
  });


  describe('createTransaction()', () => {
    describe('and the amount exceeds the balance', () => {
      it('throws an error', () => {
        expect(() => wallet.createTransaction({amount: 9999999, recipient: 'foo-recipient'})).toThrow('amount exceeds balance')
      });
    });

    describe('and the amount is valid', () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = 'foo-recipient';
        transaction = wallet.createTransaction({amount, recipient});
      })
      it('creates an instance of transaction', () => { 
        expect(transaction instanceof Transaction).toBe(true);
      });
      it('matches the transaction input with the wallet', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
       });
      it('outputs the amount the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
       });
    });
  });

  describe('calculateBalance()', () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe('and the are no outputs for the wallet', () => {
      it('returns the starting balance', () => {
        expect(Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey
        })).toEqual(STARTING_BALANCE);
      });
    });

    describe('and the are outputs for the wallet', () => {
      let transactionOne, transactionTwo;

      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50
        });

        transactionTwo = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60
        });

        blockchain.addBlock({data: [transactionOne, transactionTwo]});
      });

      it('sum all outputs for wallet output', () => {
        expect(Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey
        })).toEqual(STARTING_BALANCE + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey]);
      });
    })
  });
}); 