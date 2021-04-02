/* eslint no-undef: */
const Token = artifacts.require('DappToken');
const TomideSwap = artifacts.require('TomideSwap');

const initial_supply = 1000000

module.exports = async function(deployer){
    //deploy token
    await deployer.deploy(Token, initial_supply);
    const token = await Token.deployed();

    // deploy swap contract
    await deployer.deploy(TomideSwap);
    const tomideSwap = await TomideSwap.deployed();

    //transfer all tokens to TomideSwap address
    await token.transfer(tomideSwap.address, initial_supply)
};