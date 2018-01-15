pragma solidity ^0.4.17;

import './SGTCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol';


contract SGTCoinCrowdsale is FinalizableCrowdsale {
  uint256 private cap = 1000000000;

  function SGTCoinCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet) public
    Crowdsale(_startTime, _endTime, _rate, _wallet) {}

  // creates the token to be sold.
  // override this method to have crowdsale of a specific MintableToken token.
  function createTokenContract() internal returns (MintableToken) {
    return new SGTCoin(cap);
  }
}
