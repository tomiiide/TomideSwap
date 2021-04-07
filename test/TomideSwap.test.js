/* eslint-disable no-unused-vars */

const { assert } = require("chai");

/* eslint-disable no-undef */
const Token = artifacts.require("DappToken");
const TomideSwap = artifacts.require("Tomideswap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TomideSwap", ([deployer, investor]) => {
  let token, tomideSwap;

  before(async () => {
    token = await Token.new(tokens("1000000"));
    tomideSwap = await TomideSwap.new(token.address);

    //transfer all tokens to tomideswap
    await token.transfer(tomideSwap.address, tokens("1000000"));
  });

  describe("Dapp Token deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Tomiiide Coin");
    });
  });

  describe("TomideSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await tomideSwap.name();
      assert.equal(name, "TomideSwap Instant Decentralized Exchange");
    });

    it("contract has tokens", async () => {
      let balance = await token.balanceOf(tomideSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("TomideSwap -  buyTokens()", async () => {
    let result;
    before(async () => {
      result = await tomideSwap.buyTokens({
        from: investor,
        value: tokens("1"),
      });
    });

    it("allows user to instantly purchase tokens from TomideSwap for a fixed price", async () => {
      //check ivestors balance
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      //check ethSwap balance after purchase
      let tomideSwapBalance;
      tomideSwapBalance = await token.balanceOf(tomideSwap.address);
      assert.equal(tomideSwapBalance.toString(), tokens(`${1000000 - 100}`));

      tomideSwapBalance = await web3.eth.getBalance(tomideSwap.address);
      assert.equal(tomideSwapBalance.toString(), tokens("1"));

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("TomideSwap -  sellTokens()", async () => {
    let result;

    before(async () => {
      // investor must approve the tokens
      await token.approve(tomideSwap.address, tokens("100"), {
        from: investor
      });
      //sell tokens
      result = await tomideSwap.sellTokens(tokens("100"), { from: investor });
    });

    it("allows user to instantly sell tokens to TomideSwap for a fixed price", async () => {
      //check ivestors balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));

      //check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");

      //FAILURE: investor can't sell more tokens than they have
      await tomideSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
