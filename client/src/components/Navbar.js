import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ account }) => {
  // Function to truncate Ethereum address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">UGC Tracker</Link>
      
      {account && (
        <>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create Content</Link>
            </li>
            <li>
              <Link to="/my-content">My Content</Link>
            </li>
            <li>
              <Link to="/reports">Reports</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li>
              <Link to="/activity-demo">Activity Demo</Link>
            </li>
          </ul>
          
          <div className="account">
            Connected: {truncateAddress(account)}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar; 