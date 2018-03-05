const Token = artifacts.require('SGTCoin');
const Crowdsale = artifacts.require('SGTCoinCrowdsale');

const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));

contract('SGT Token Crowdsale', (accounts) => {
    it('only allow contract owner to access whitelisting functions', async () => {
        const crowdsale = await Crowdsale.deployed();

        // False cases: assert non-owner cannot modify whitelist
        try {
            await crowdsale.addToWhitelist(accounts[1], {from: accounts[1]});
        } catch (e) {} finally {
            const resultA = await crowdsale.whitelist.call(accounts[1]);
            assert.equal(resultA, false);
        }

        try {
            await crowdsale.addToWhitelist(accounts[1], {from: accounts[0]});
            await crowdsale.removeFromWhitelist(accounts[1], {from: accounts[1]});
        } catch (e) {} finally {
            const resultB = await crowdsale.whitelist.call(accounts[1]);
            assert.equal(resultB, true);
        }

        // True cases: assert owner can modify whitelist
        await crowdsale.addToWhitelist(accounts[2], {from: accounts[0]});
        const resultC = await crowdsale.whitelist.call(accounts[2]);
        assert.equal(resultC, true);

        await crowdsale.removeFromWhitelist(accounts[2], {from: accounts[0]});
        const resultD = await crowdsale.whitelist.call(accounts[2]);
        assert.equal(resultD, false);
    });

    it('only whitelisted addresses can buy tokens', async () => {
        const crowdsale = await Crowdsale.deployed();
        const token = await Token.deployed();

        await crowdsale.addToWhitelist(accounts[2], {from: accounts[0]});
        await crowdsale.sendTransaction({from: accounts[2], value: ether(1)});

        const balance = await token.balanceOf.call(accounts[2]);
        assert.equal(balance.toString(10), ether(800).toString(10));
    });
});
