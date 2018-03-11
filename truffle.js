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
                return new HDWalletProvider('38919eb12c670bd1aea9a7d352ade2828758b9b300c49795d19f4e7d0d48a2ad', 'https://rinkeby.infura.io/MlFcFEbMWgcTg5TASU2a');
            },
            network_id: '3' // Match any network id
        }
    }
};
