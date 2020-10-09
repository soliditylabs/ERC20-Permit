usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-web3");
usePlugin("buidler-deploy");

module.exports = {
  solc: {
    version: "0.7.2",
  },
  buidlerevm: {
    loggingEnabled: "true",
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how buidler network are configured, the account 0 on one network can be different than on another
    },
  },
};
