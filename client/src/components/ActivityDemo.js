import React, { useState } from 'react';
import NotificationService, { ActivityTypes, NotificationChannels } from '../services/NotificationService';

const ActivityDemo = ({ account }) => {
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [selectedActivity, setSelectedActivity] = useState(ActivityTypes.LOGIN);
  const [selectedChannel, setSelectedChannel] = useState(NotificationChannels.EMAIL);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentId, setContentId] = useState('1');
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const activityOptions = [
    { id: ActivityTypes.LOGIN, name: 'Login' },
    { id: ActivityTypes.LOGOUT, name: 'Logout' },
    { id: ActivityTypes.SEARCH, name: 'Search' },
    { id: ActivityTypes.CREATE, name: 'Create Content' },
    { id: ActivityTypes.UPDATE, name: 'Update Content' },
    { id: ActivityTypes.DELETE, name: 'Delete Content' },
    { id: ActivityTypes.LIKE, name: 'Like Content' },
    { id: ActivityTypes.UNLIKE, name: 'Unlike Content' }
  ];

  const channelOptions = [
    { id: NotificationChannels.NONE, name: 'None' },
    { id: NotificationChannels.EMAIL, name: 'Email' },
    { id: NotificationChannels.SMS, name: 'SMS' },
    { id: NotificationChannels.WHATSAPP, name: 'WhatsApp' },
    { id: NotificationChannels.ALL, name: 'All Channels' }
  ];

  const handleTriggerActivity = async () => {
    setLoading(true);
    setNotificationStatus(null);
    
    try {
      // Create user object
      const user = {
        address: account,
        email,
        phone
      };
      
      // Create data object based on activity type
      const data = {};
      
      if (selectedActivity === ActivityTypes.SEARCH) {
        data.query = searchQuery;
      } else if ([ActivityTypes.CREATE, ActivityTypes.UPDATE, ActivityTypes.DELETE, ActivityTypes.LIKE, ActivityTypes.UNLIKE].includes(selectedActivity)) {
        data.contentId = contentId;
      }
      
      // Track activity and send notification
      const result = await NotificationService.trackActivity(
        user,
        selectedActivity,
        selectedChannel,
        data
      );
      
      setNotificationStatus({
        success: result.success,
        message: result.success 
          ? 'Notification sent successfully!' 
          : `Error: ${result.error || 'Unknown error'}`
      });
    } catch (error) {
      console.error('Error triggering activity:', error);
      setNotificationStatus({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-demo">
      <h2>Activity & Notification Demo</h2>
      <p>
        This demo allows you to simulate different user activities and see how notifications
        would be sent based on your preferences.
      </p>
      
      <div className="demo-container">
        <div className="user-info">
          <h3>User Information</h3>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="activity-selection">
          <h3>Activity Settings</h3>
          
          <div className="form-group">
            <label htmlFor="activity">Activity Type</label>
            <select
              id="activity"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(parseInt(e.target.value))}
            >
              {activityOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="channel">Notification Channel</label>
            <select
              id="channel"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(parseInt(e.target.value))}
            >
              {channelOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedActivity === ActivityTypes.SEARCH && (
            <div className="form-group">
              <label htmlFor="searchQuery">Search Query</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search query"
              />
            </div>
          )}
          
          {[ActivityTypes.CREATE, ActivityTypes.UPDATE, ActivityTypes.DELETE, ActivityTypes.LIKE, ActivityTypes.UNLIKE].includes(selectedActivity) && (
            <div className="form-group">
              <label htmlFor="contentId">Content ID</label>
              <input
                type="text"
                id="contentId"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="Enter content ID"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="demo-actions">
        <button 
          onClick={handleTriggerActivity}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Trigger Activity & Notification'}
        </button>
      </div>
      
      {notificationStatus && (
        <div className={`notification-status ${notificationStatus.success ? 'success' : 'error'}`}>
          <p>{notificationStatus.message}</p>
          {notificationStatus.success && (
            <p className="notification-hint">
              Check the browser console to see the simulated notification details.
            </p>
          )}
        </div>
      )}
      
      <div className="demo-info">
        <h3>How It Works</h3>
        <p>
          In a real application, these notifications would be sent through actual email, SMS, and WhatsApp services.
          For this demo, the notifications are simulated and logged to the browser console.
        </p>
        <p>
          The activity tracking system would typically be integrated with the application's authentication
          and content management systems to automatically track user activities.
        </p>
      </div>
    </div>
  );
};

export default ActivityDemo; 