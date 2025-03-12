require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: './client/src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    // Add other networks as needed (e.g., Goerli, Sepolia, Mainnet)
  }
}; 