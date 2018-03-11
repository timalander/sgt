pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

import "./SGTCoin.sol";
import "./SGTCoinCrowdsale.sol";


contract SGTCoinPreCrowdsale is SGTCoinCrowdsale {
    function SGTCoinPreCrowdsale (
        uint256 _rate,
        address _wallet,
        SGTCoin _token,
        uint256 _cap
    ) public
    SGTCoinCrowdsale(_rate, _wallet, _token, _cap) {}
}
