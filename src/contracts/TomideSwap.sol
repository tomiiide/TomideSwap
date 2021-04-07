pragma solidity ^0.5.16;

import "./TomiCoin.sol";

contract TomideSwap {
    string public name = "TomideSwap Instant Decentralized Exchange";
    DappToken public token;
    uint public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );
    
    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

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
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {

        // require that TomideSwap has enough ether for the sale
        require(token.balanceOf(address(this)) >= _amount);

        //calculate the amount of tokens to buy
        uint etherAmount = _amount / rate;

        // require that user has enough ether to sell
        require(address(this).balance >= etherAmount);
        
        // perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        //emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}