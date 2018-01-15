pragma solidity ^0.4.17;

import './SGTCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol';


contract SGTCoinCrowdsale is FinalizableCrowdsale {
  SGTCoin public tokenContract;

  // Initialize new Crowdsale()
  function SGTCoinCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet, uint256 _cap) public
    Crowdsale(_startTime, _endTime, _rate, _wallet) {
      tokenContract = new SGTCoin(_cap);
    }

  // Overrides method in OZ implementation of Crowdsale()
  function createTokenContract() internal returns (MintableToken) {
    return tokenContract;
  }
}
