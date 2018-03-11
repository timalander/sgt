const SGTCoin = artifacts.require('SGTCoin');
const SGTCoinCrowdsale = artifacts.require('SGTCoinCrowdsale');
const SGTCoinPreCrowdsale = artifacts.require('SGTCoinPreCrowdsale');
const SGTEscrow = artifacts.require('SGTEscrow');

const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));

module.exports = (deployer) => {
    let tokenInstance, escrowInstance;

    const tokenCap = ether(100000000);
    const SECURE_WALLET = '0x25C17D68266619A03ACF6cA0E92EAfD384E6f35E';

    deployer.deploy(SGTCoin, tokenCap)
    .then(() => {
        return SGTCoin.deployed();
    })
    .then((instance) => {
        tokenInstance = instance;
        return deployer.deploy(SGTEscrow, SGTCoin.address);
    })
    .then(() => {
        return SGTEscrow.deployed();
    })
    .then((instance) => {
        escrowInstance = instance;
        return tokenInstance.mint(SGTEscrow.address, ether(49000000));
    })
    .then(() => {
        return tokenInstance.mint(SECURE_WALLET, ether(1000000));
    })
    .then(() => {
        const rate = new web3.BigNumber(1600);
        const crowdsaleCap = ether(1000000);
        return deployer.deploy(SGTCoinPreCrowdsale, rate, SECURE_WALLET, SGTCoin.address, crowdsaleCap);
    })
    .then(() => {
        const rate = new web3.BigNumber(800);
        const crowdsaleCap = ether(49000000);
        return deployer.deploy(SGTCoinCrowdsale, rate, SECURE_WALLET, SGTCoin.address, crowdsaleCap);
    })
    .then(() => {
        return tokenInstance.transferOwnership(SGTCoinCrowdsale.address);
    });
};
