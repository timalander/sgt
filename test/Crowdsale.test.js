const Token = artifacts.require('SGTCoin');
const Crowdsale = artifacts.require('SGTCoinCrowdsale');

const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));

contract('SGT Token Crowdsale', (accounts) => {
    let crowdsale, token, crowdsaleCap, tokenCap;

    beforeEach(async () => {
        tokenCap = crowdsaleCap = ether(2400);
        token = await Token.new(tokenCap);

        const rate = new web3.BigNumber(800);
        crowdsale = await Crowdsale.new(rate, accounts[9], token.address, crowdsaleCap);
        await token.transferOwnership(crowdsale.address);
    });

    it('should only allow contract owner to access whitelisting functions', async () => {
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

    it('should only whitelisted addresses can buy tokens', async () => {
        // True cases: assert whitelisted accounts can buy tokens at set rate
        await crowdsale.addToWhitelist(accounts[2], {from: accounts[0]});
        await crowdsale.sendTransaction({from: accounts[2], value: ether(1)});

        const resultA = await token.balanceOf.call(accounts[2]);
        assert.equal(resultA.toString(10), ether(800).toString(10));

        // False cases: assert non-whitelisted accounts cannot buy tokens
        try {
            await crowdsale.sendTransaction({from: accounts[4], value: ether(1)});
        } catch (e) {} finally {
            const resultB = await token.balanceOf.call(accounts[4]);
            assert.equal(resultB.toString(10), ether(0).toString(10));
        }
    });

    it('should only allow sales up until the crowdsale cap', async () => {
        await crowdsale.addToWhitelist(accounts[1], {from: accounts[0]});

        // Buy all of the tokens
        await crowdsale.sendTransaction({from: accounts[1], value: ether(3)});
        const resultA = await token.balanceOf.call(accounts[1]);
        assert.equal(resultA.toString(10), tokenCap.toString(10));

        // Assert balance does not change once cap is hit
        try {
            await crowdsale.sendTransaction({from: accounts[1], value: ether(1)});
        } catch (e) {} finally {
            const resultB = await token.balanceOf.call(accounts[1]);
            assert.equal(resultB.toString(10), tokenCap.toString(10));
        }
    });
});
