pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

import "./SGTCoin.sol";


contract SGTEscrow is Ownable {
    using SafeMath for uint256;

    SGTCoin public token;
    uint256 public contractStart;
    mapping(uint256 => bool) public hasRoundBeenWithdrawn;

    function SGTEscrow() public {
        contractStart = now;
    }

    function setToken(SGTCoin _token) public onlyOwner {
        token = _token;
    }

    function withdrawRound (uint256 round, address destination) public onlyOwner {
        require(destination != address(0));
        require(round > 0);
        require(round < 50);
        require(hasRoundBeenWithdrawn[round] != true);

        // Validate round falls in the correct timeframe
        uint256 roundOffset = round.mul(30 days);
        uint256 minimumDateForRound = contractStart.add(roundOffset);
        require(now > minimumDateForRound);

        hasRoundBeenWithdrawn[round] = token.transfer(destination, 1000000 ether);
    }
}
