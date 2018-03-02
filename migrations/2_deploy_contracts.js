const SGTCoin = artifacts.require('SGTCoin');
const SGTCoinCrowdsale = artifacts.require('SGTCoinCrowdsale');

const ether = (n) => {
  return new web3.BigNumber(web3.toWei(n, 'ether'));
}

module.exports = (deployer) => {
  const tokenCap = ether(100000000);
  deployer.deploy(SGTCoin, tokenCap).then(() => {
      const rate = new web3.BigNumber(800);
      const crowdsaleCap = ether(50000000);
      const walletAddress = '0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE';
      return deployer.deploy(SGTCoinCrowdsale, rate, walletAddress, SGTCoin.address, crowdsaleCap);
  });
};
