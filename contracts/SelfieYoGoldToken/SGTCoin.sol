pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/CappedToken.sol';

contract SGTCoin is CappedToken {
  string public constant name = "SelfieYo Gold Token";
  string public constant symbol = "SGT";
  uint8 public constant decimals = 18;

  function SGTCoin(uint256 _cap) public
    CappedToken(_cap) {}
}
