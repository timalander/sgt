const SGTCoin = artifacts.require('SGTCoin');
const SGTCoinCrowdsale = artifacts.require('SGTCoinCrowdsale');
const SGTEscrow = artifacts.require('SGTEscrow');

const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));
const million = (n) => n * 1000000;

module.exports = (deployer) => {
    let tokenInstance, escrowInstance;

    const tokenCap = ether(million(100));
    const SECURE_WALLET = '0xA5eB6ec21A4a099D1Db4c444253a291c2E382A1c';
    const INFLUENCER_POOL = '0xBa99b004908F4bd5443eFaB5B3cbF281e34D0C00';
    const PRESALE_FUNDS = '0x7471De9927E3FCc76f1Fe6beeD9BA1E2e3DFdB54';

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
