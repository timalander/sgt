pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

import "./SGTCoin.sol";


contract SGTCoinCrowdsale is WhitelistedCrowdsale, CappedCrowdsale {
    SGTCoin public token;

    function SGTCoinCrowdsale (
        uint256 _rate,
        address _wallet,
        SGTCoin _token,
        uint256 _cap
    ) public
    CappedCrowdsale(_cap)
    Crowdsale(_rate, _wallet, _token) {
        token = _token;
    }

    function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
        token.mint(_beneficiary, _tokenAmount);
    }
}
