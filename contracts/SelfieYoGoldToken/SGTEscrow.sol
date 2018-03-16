pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

import "./SGTCoin.sol";


contract SGTEscrow is Ownable {
    using SafeMath for uint256;

    SGTCoin public token;
    uint256 public contractStart;
    address public constant VESTING_WALLET = 0x58DD9FCaf9b16F7049A1c9315781aBB748D96Cf6;
    mapping(uint256 => bool) public hasRoundBeenWithdrawn;

    function SGTEscrow(SGTCoin _token) public {
        contractStart = now;
        token = _token;
    }

    function withdrawRound (uint256 round) public onlyOwner {
        require(round > 0);
        require(round < 50);
        require(hasRoundBeenWithdrawn[round] != true);

        // Validate round falls in the correct timeframe
        uint256 roundOffset = round.mul(30 days);
        uint256 minimumDateForRound = contractStart.add(roundOffset);
        require(now > minimumDateForRound);

        hasRoundBeenWithdrawn[round] = token.transfer(VESTING_WALLET, 1000000 ether);
    }
}
