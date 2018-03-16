const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        rinkeby_priv:  {
            host: "localhost",
            port: 8545,
            gas: 2900000,
            provider: () => {
                return new HDWalletProvider('PRIV_KEY', 'https://rinkeby.infura.io/API_KEY');
            },
            network_id: '3' // Match any network id
        }
    }
};
