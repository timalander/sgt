const SGTCoin = artifacts.require('SGTCoin');
const SGTCoinCrowdsale = artifacts.require('SGTCoinCrowdsale');
const SGTEscrow = artifacts.require('SGTEscrow');

const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));
const million = (n) => n * 1000000;

module.exports = (deployer) => {
    let tokenInstance, escrowInstance;

    const tokenCap = ether(million(100));
    const SECURE_WALLET = '0x25C17D68266619A03ACF6cA0E92EAfD384E6f35E';
    const INFLUENCER_POOL = '';
    const PRESALE_FUNDS = '';

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
        return tokenInstance.mint(SGTEscrow.address, ether(million(49)));
    })
    .then(() => {
        return tokenInstance.mint(INFLUENCER_POOL, ether(million(1)));
    })
    .then(() => {
        return tokenInstance.mint(PRESALE_FUNDS, ether(million(2)));
    })
    .then(() => {
        const rate = new web3.BigNumber(800);
        const crowdsaleCap = ether(million(48));
        return deployer.deploy(SGTCoinCrowdsale, rate, SECURE_WALLET, SGTCoin.address, crowdsaleCap);
    })
    .then(() => {
        return tokenInstance.transferOwnership(SGTCoinCrowdsale.address);
    });
};
