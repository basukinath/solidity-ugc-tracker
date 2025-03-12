import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Import the NotificationPreferences ABI
// In a real app, this would be imported from artifacts
const NotificationPreferencesABI = [
  "function registerUser(string memory _email, string memory _phone) public",
  "function updatePreference(uint8 _activityType, uint8 _channel) public",
  "function updateContactInfo(string memory _email, string memory _phone) public",
  "function isUserRegistered(address _user) public view returns (bool)",
  "function getContactInfo(address _user) public view returns (string memory email, string memory phone)",
  "event UserRegistered(address indexed user, string email, string phone)",
  "event PreferenceUpdated(address indexed user, uint8 activityType, uint8 channel)",
  "event ContactInfoUpdated(address indexed user, string email, string phone)"
];

// Activity types and notification channels
const activityTypes = [
  { id: 0, name: 'Login', description: 'When you log in to the application' },
  { id: 1, name: 'Logout', description: 'When you log out of the application' },
  { id: 2, name: 'Search', description: 'When you search for content' },
  { id: 3, name: 'Create', description: 'When you create new content' },
  { id: 4, name: 'Update', description: 'When you update existing content' },
  { id: 5, name: 'Delete', description: 'When you delete content' },
  { id: 6, name: 'Like', description: 'When you like content' },
  { id: 7, name: 'Unlike', description: 'When you unlike content' }
];

const notificationChannels = [
  { id: 0, name: 'None', description: 'No notifications' },
  { id: 1, name: 'Email', description: 'Receive notifications via email' },
  { id: 2, name: 'SMS', description: 'Receive notifications via SMS' },
  { id: 3, name: 'WhatsApp', description: 'Receive notifications via WhatsApp' },
  { id: 4, name: 'All', description: 'Receive notifications via all channels' }
];

const NotificationPreferences = ({ account }) => {
  const [notificationContract, setNotificationContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum && account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          
          // Replace with your deployed contract address
          const contractAddress = "0xYourNotificationPreferencesContractAddress";
          
          const contract = new ethers.Contract(
            contractAddress,
            NotificationPreferencesABI,
            signer
          );
          
          setNotificationContract(contract);
          
          // Check if user is registered
          const registered = await contract.isUserRegistered(account);
          setIsRegistered(registered);
          
          if (registered) {
            // Get user's contact info
            const contactInfo = await contract.getContactInfo(account);
            setEmail(contactInfo.email);
            setPhone(contactInfo.phone);
            
            // Initialize preferences (in a real app, we would fetch these from the contract)
            const initialPrefs = {};
            activityTypes.forEach(activity => {
              initialPrefs[activity.id] = 1; // Default to Email
            });
            setPreferences(initialPrefs);
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error initializing notification contract:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initContract();
  }, [account]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !phone) {
      alert("Please provide both email and phone number");
      return;
    }
    
    try {
      setRegistering(true);
      
      const tx = await notificationContract.registerUser(email, phone);
      await tx.wait();
      
      setIsRegistered(true);
      
      // Initialize preferences
      const initialPrefs = {};
      activityTypes.forEach(activity => {
        initialPrefs[activity.id] = 1; // Default to Email
      });
      setPreferences(initialPrefs);
      
      setRegistering(false);
      alert("Successfully registered for notifications!");
    } catch (error) {
      console.error("Error registering for notifications:", error);
      setRegistering(false);
      alert(`Error registering: ${error.message}`);
    }
  };

  const handleUpdateContactInfo = async (e) => {
    e.preventDefault();
    
    if (!email || !phone) {
      alert("Please provide both email and phone number");
      return;
    }
    
    try {
      setUpdating(true);
      
      const tx = await notificationContract.updateContactInfo(email, phone);
      await tx.wait();
      
      setUpdating(false);
      alert("Contact information updated successfully!");
    } catch (error) {
      console.error("Error updating contact info:", error);
      setUpdating(false);
      alert(`Error updating contact info: ${error.message}`);
    }
  };

  const handlePreferenceChange = async (activityId, channelId) => {
    try {
      const tx = await notificationContract.updatePreference(activityId, channelId);
      await tx.wait();
      
      setPreferences(prev => ({
        ...prev,
        [activityId]: channelId
      }));
      
      console.log(`Updated preference for activity ${activityId} to channel ${channelId}`);
    } catch (error) {
      console.error("Error updating preference:", error);
      alert(`Error updating preference: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading notification preferences...</div>;
  }

  return (
    <div className="notification-preferences">
      <h2>Notification Preferences</h2>
      
      {!isRegistered ? (
        <div className="registration-form">
          <p>Register to receive notifications about your activities</p>
          
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number (with country code)</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={registering}
            >
              {registering ? 'Registering...' : 'Register for Notifications'}
            </button>
          </form>
        </div>
      ) : (
        <div className="preferences-container">
          <div className="contact-info">
            <h3>Contact Information</h3>
            
            <form onSubmit={handleUpdateContactInfo}>
              <div className="form-group">
                <label htmlFor="update-email">Email Address</label>
                <input
                  type="email"
                  id="update-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="update-phone">Phone Number</label>
                <input
                  type="tel"
                  id="update-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-secondary"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Contact Info'}
              </button>
            </form>
          </div>
          
          <div className="preferences-table">
            <h3>Activity Notification Preferences</h3>
            <p>Choose how you want to be notified for each activity type</p>
            
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Description</th>
                  <th>Notification Channel</th>
                </tr>
              </thead>
              <tbody>
                {activityTypes.map(activity => (
                  <tr key={activity.id}>
                    <td>{activity.name}</td>
                    <td>{activity.description}</td>
                    <td>
                      <select
                        value={preferences[activity.id] || 0}
                        onChange={(e) => handlePreferenceChange(activity.id, parseInt(e.target.value))}
                      >
                        {notificationChannels.map(channel => (
                          <option key={channel.id} value={channel.id}>
                            {channel.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="notification-info">
            <h3>About Notifications</h3>
            <p>
              You will receive notifications based on your preferences above. 
              Notifications may be delayed depending on network conditions.
            </p>
            <ul>
              <li><strong>Email notifications</strong> will be sent to your registered email address</li>
              <li><strong>SMS notifications</strong> will be sent to your registered phone number</li>
              <li><strong>WhatsApp notifications</strong> will be sent to your registered phone number via WhatsApp</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences; 