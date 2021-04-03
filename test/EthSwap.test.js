const Token = artifacts.require('DappToken')
const TomideSwap = artifacts.require('Tomideswap')

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TomideSwap', ([deployer, investor]) => {
    let token, tomideSwap

    before(async () => {
         token = await Token.new(tokens('1000000'))
         tomideSwap = await TomideSwap.new(token.address)

        //transfer all tokens to tomideswap
        await token.transfer(tomideSwap.address, tokens('1000000'))

    })

    describe('Dapp Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'Tomiiide Coin')
        })
    })
    
    describe('TomideSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await tomideSwap.name()
            assert.equal(name, 'TomideSwap Instant Decentralized Exchange')
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(tomideSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('TomideSwap -  buyTokens()', async () => {
        let result;
        before(async () => {
            result = tomideSwap.buyTokens({from: investor, value: tokens('1')})
       })

        it('allows user to instantly purchase tokens from TomideSwap for a fixed price', async () => {
            //check ivestors balance
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            //check ethSwap balance after purchase
            let tomideSwapBalance
            tomideSwapBalance = await token.balanceOf(tomideSwap.address)
            assert.equal(tomideSwapBalance.toString(), tokens(`${1000000 - 100}`))

            tomideSwapBalance = await web3.eth.getBalance(tomideSwap.address)
            assert.equal(tomideSwapBalance.toString(), tokens('1'))
        })
    })

})