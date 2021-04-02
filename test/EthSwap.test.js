const Token = artifacts.require('DappToken')
const TomideSwap = artifacts.require('Tomideswap')

require('chai').use(require('chai-as-promised')).should()

contract('TomideSwap', (accounts) => {

    describe('Dapp Token deployment', async () => {
        it('contract has a name', async () => {
            let token = await Token.new('10000')
            const name = await token.name()
            assert.equal(name, 'Tomiiide Coin')
        })
    })
    
    describe('TomideSwap deployment', async () => {
        it('contract has a name', async () => {
            let tomideSwap = await TomideSwap.new()
            const name = await tomideSwap.name()
            assert.equal(name, 'TomideSwap Instant Decentralized Exchange')
        })
    })

})