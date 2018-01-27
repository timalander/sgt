const Crowdsale = artifacts.require('SGTCoinCrowdsale');

contract('SGT Token Crowdsale', accounts => {
  it('only allow contract owner to access whitelisting functions', async () => {
    const instance = await Crowdsale.deployed();

    // False cases: assert non-owner cannot modify whitelist
    try {
      await instance.addToWhitelist(accounts[1], {from: accounts[1]});
    } catch (e) {} finally {
      const resultA = await instance.whitelist.call(accounts[1]);
      assert.equal(resultA, false);
    }

    try {
      await instance.addToWhitelist(accounts[1], {from: accounts[0]});
      await instance.removeFromWhitelist(accounts[1], {from: accounts[1]});
    } catch (e) {} finally {
      const resultB = await instance.whitelist.call(accounts[1]);
      assert.equal(resultB, true);
    }

    // True cases: assert owner can modify whitelist
    await instance.addToWhitelist(accounts[2], {from: accounts[0]});
    const resultC = await instance.whitelist.call(accounts[2]);
    assert.equal(resultC, true);

    await instance.removeFromWhitelist(accounts[2], {from: accounts[0]});
    const resultD = await instance.whitelist.call(accounts[2]);
    assert.equal(resultD, false);
  });
});
