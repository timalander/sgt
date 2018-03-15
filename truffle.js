const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        rinkeby:  {
            host: "localhost",
            port: 8545,
            gas: 2900000,
            provider: () => {
                var engine = new ProviderEngine();
                engine.addProvider(new TrezorProvider("m/44'/1'/0'/0/0"));
                engine.addProvider(new FiltersSubprovider());
                engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider("http://ropsten.infura.com/{key}")));
                engine.start();
            },
            network_id: '*' // Match any network id
        },
        rinkeby_priv:  {
            host: "localhost",
            port: 8545,
            gas: 2900000,
            provider: () => {
                return new HDWalletProvider('TEST_KEY', 'https://rinkeby.infura.io/API_KEY');
            },
            network_id: '3' // Match any network id
        }
    }
};
