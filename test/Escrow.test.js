const Token = artifacts.require('SGTCoin');
const Escrow = artifacts.require('SGTEscrow');

const {increaseTime, duration} = require('./helpers/time.js');

const ether = (n) => new web3.BigNumber(web3.toWei(n, 'ether'));

contract('SGT Token Escrow', (accounts) => {
    let escrow, token, tokenCap;

    beforeEach(async () => {
        tokenCap = ether(49000000);
        token = await Token.new(tokenCap);
        escrow = await Escrow.new(token.address);

        await token.mint(escrow.address, tokenCap, {from: accounts[0]});
    });

    it('should not allow any payouts before 1 month time intervals', async () => {
        for (let i = 1; i < 50; i++) {
            await increaseTime(duration.days(30) - duration.minutes(1));

            try {
                await escrow.withdrawRound(i, accounts[5], {from: accounts[0]});
            } catch (e) {} finally {
                const resultA = await token.balanceOf.call(accounts[5]);
                assert.equal(resultA.toString(10), ether(0).toString(10));
            }
        }
    });

    it('should not allow payouts to non-owner', async () => {
        await increaseTime(duration.days(31));

        try {
            await escrow.withdrawRound(1, accounts[1], {from: accounts[1]});
        } catch (e) {} finally {
            const resultA = await token.balanceOf.call(accounts[1]);
            assert.equal(resultA.toString(10), ether(0).toString(10));
        }
    });

    it('should not be able to call a round more than once', async () => {
        await increaseTime(duration.days(31));

        await escrow.withdrawRound(1, accounts[6], {from: accounts[0]});
        const resultA = await token.balanceOf.call(accounts[6]);
        assert.equal(resultA.toString(10), ether(1000000).toString(10));

        try {
            await escrow.withdrawRound(1, accounts[6], {from: accounts[0]});
        } catch (e) {} finally {
            const resultB = await token.balanceOf.call(accounts[6]);
            assert.equal(resultB.toString(10), ether(1000000).toString(10));
        }
    });

    it('should be able to call all rounds once 49 months have passed', async () => {
        await increaseTime(duration.days((30 * 49) + 1));

        for (let i = 1; i < 50; i++) {
            try {
                await escrow.withdrawRound(i, accounts[5], {from: accounts[0]});
            } catch (e) {} finally {
                const resultA = await token.balanceOf.call(accounts[5]);
                assert.equal(resultA.toString(10), ether(1000000 * i).toString(10));
            }
        }
    });
});
