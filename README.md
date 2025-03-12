# Solidity User-Generated Content Tracker

A decentralized application for tracking and managing user-generated content on the Ethereum blockchain.

## Features

- Create, update, and remove content
- Store content metadata on the blockchain
- Store actual content on IPFS (decentralized storage)
- Like/unlike content
- View content created by all users
- Manage your own content

## Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, ethers.js
- **Storage**: IPFS via Web3.Storage
- **Testing**: Chai, Waffle

## Project Structure

```
solidity-ugc-tracker/
├── contracts/             # Smart contracts
│   └── UserContent.sol    # Main contract for content management
├── scripts/               # Deployment scripts
│   └── deploy.js          # Script to deploy the UserContent contract
├── test/                  # Test files
│   └── UserContent.test.js # Tests for the UserContent contract
├── client/                # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React components and logic
├── hardhat.config.js      # Hardhat configuration
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd solidity-ugc-tracker
   ```

2. Install dependencies:
   ```
   npm install
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PRIVATE_KEY=your_private_key_here
   WEB3_STORAGE_API_KEY=your_web3_storage_api_key_here
   ```

4. Update the Web3Storage API key in `client/src/components/CreateContent.js`

### Running the Application

1. Start a local Ethereum node:
   ```
   npm run node
   ```

2. In a new terminal, deploy the contract:
   ```
   npm run deploy
   ```

3. Update the contract address in `client/src/App.js` with the deployed contract address

4. Start the React application:
   ```
   npm run client
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Testing

Run the test suite:
```
npm test
```

## Deployment to a Testnet

1. Update the `hardhat.config.js` file with your desired network configuration
2. Run the deployment script with the network flag:
   ```
   npx hardhat run scripts/deploy.js --network goerli
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Web3.Storage for IPFS integration
- Hardhat for the development environment 