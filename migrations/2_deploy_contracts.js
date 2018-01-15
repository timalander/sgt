var SGTCoinCrowdsale = artifacts.require("SGTCoinCrowdsale.sol");

module.exports = function(deployer) {
  const userAddress = '0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE';
  deployer.deploy(SGTCoinCrowdsale, Date.now() + 600000, Date.now() + 10000000, 800, userAddress, {from: userAddress, gas: 6721975, gasPrice: 20000000000});
};
