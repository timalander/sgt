var SGTCoinCrowdsale = artifacts.require('SGTCoinCrowdsale');

module.exports = function(deployer) {
  var userAddress = '0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE';
  deployer.deploy(SGTCoinCrowdsale, Date.now() + 600000, Date.now() + 10000000, 800, userAddress, 1000000);
};
