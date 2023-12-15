const Wallet = require('./index');
const {verifySignature} = require('./../util');

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
}); 