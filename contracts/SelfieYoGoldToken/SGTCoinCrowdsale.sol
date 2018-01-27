pragma solidity ^0.4.17;

import './SGTCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol';

contract SGTCoinCrowdsale is FinalizableCrowdsale {

  // SGT token contract
  SGTCoin public tokenContract;

  /*
  //  Whitelist of approved addresses to interact with the crowdsale
  //
  //  Only truthy values are valid:
  //  addresses can be removed from the crowdsale by setting value to false
  */
  mapping (address => bool) public whitelist;

  // Initialize new Crowdsale()
  function SGTCoinCrowdsale(
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet,
    uint256 _cap
  ) public Crowdsale(_startTime, _endTime, _rate, _wallet) {
      tokenContract = new SGTCoin(_cap);
  }

  // Modifier that throws if sender is not on the whitelist
  modifier onlyWhitelisted() {
    require(whitelist[msg.sender] == true);
    _;
  }

  // Allow an address to interact with the crowdsale
  function addToWhitelist(address _address) public onlyOwner {
    whitelist[_address] = true;
  }

  // Disallow an address from interacting with the crowdsale
  function removeFromWhitelist(address _address) public onlyOwner {
    whitelist[_address] = false;
  }

  // Overrides method in OZ implementation of Crowdsale.sol
  // Returns the `SGTCoin` contract
  function createTokenContract() internal returns (MintableToken) {
    return tokenContract;
  }

  // Overrides method in OZ implementation of Crowdsale.sol
  // Adding `whitelisted` modifier
  function validPurchase() internal onlyWhitelisted view returns (bool) {
    super.validPurchase();
  }
}
