/** Credit to the Open Zeppelin test suite **/

// Returns the time of the last mined block in seconds
module.exports.latestTime = () => web3.eth.getBlock('latest').timestamp;

// Increases testrpc time by the passed duration in seconds
module.exports.increaseTime = async (duration) => {
    const id = Date.now();

    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [duration],
            id: id,
        }, err1 => {
            if (err1) return reject(err1);
            web3.currentProvider.sendAsync({
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: id + 1,
            }, (err2, res) => {
                return err2 ? reject(err2) : resolve(res);
            });
        });
    });
};

module.exports.duration = {
    seconds: (val) => val,
    minutes: (val) => val * 60,
    hours: (val) => val * 60 * 60,
    days: (val) => val * 60 * 60 * 24,
    weeks: (val) => val * 60 * 60 * 24 * 7,
    years: (val) => val * 60 * 60 * 24 * 7 * 365,
};
