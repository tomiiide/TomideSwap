pragma solidity ^0.5.16;

import "./Token.sol";

contract TomideSwap {
    string public name = "TomideSwap Instant Decentralized Exchange";
    DappToken public token;
    uint public rate = 100;

    constructor(DappToken _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // calculate the amount of tokens to buy
        uint tokenAmount = rate * msg.value;
        token.transfer(msg.sender, tokenAmount);
    }
}