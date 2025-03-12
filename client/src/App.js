import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateContent from './components/CreateContent';
import MyContent from './components/MyContent';
import ContentDetails from './components/ContentDetails';
import UserReports from './components/UserReports';
import NotificationPreferences from './components/NotificationPreferences';
import Footer from './components/Footer';
import ActivityDemo from './components/ActivityDemo';

// Contract ABI and address
import UserContentArtifact from './artifacts/contracts/UserContent.sol/UserContent.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          setAccount(account);

          // Create ethers provider and signer
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          const signer = provider.getSigner();

          // Get the network
          const network = await provider.getNetwork();
          
          // Get deployed contract address (this would come from your deployment)
          // For development, you might hardcode this or store it in a config file
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address
          
          // Create contract instance
          const userContentContract = new ethers.Contract(
            contractAddress,
            UserContentArtifact.abi,
            signer
          );
          
          setContract(userContentContract);
          setIsLoading(false);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
          setIsLoading(false);
        }
      } else {
        console.log("Please install MetaMask!");
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading application...</div>;
  }

  return (
    <div className="app">
      <Navbar account={account} />
      <main className="container">
        {!account ? (
          <div className="connect-wallet">
            <h2>Please connect your wallet to use this application</h2>
            <button 
              onClick={async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
              }}
              className="btn btn-primary"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home contract={contract} account={account} />} />
            <Route path="/create" element={<CreateContent contract={contract} account={account} />} />
            <Route path="/my-content" element={<MyContent contract={contract} account={account} />} />
            <Route path="/content/:id" element={<ContentDetails contract={contract} account={account} />} />
            <Route path="/reports" element={<UserReports contract={contract} account={account} />} />
            <Route path="/notifications" element={<NotificationPreferences account={account} />} />
            <Route path="/activity-demo" element={<ActivityDemo account={account} />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App; 