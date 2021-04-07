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

        // require that TomideSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount );

        // Transfer tokens to the user
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(unit _amount) public payable {
        //calculate the amount of tokens to buy
        unit etherAmount = amount / rate;
        
        require(token.balanceOf(address(msg.sender)) >= tokenAmount );

        msg.sender.transfer(this, tokenAmount);

        
    }
}