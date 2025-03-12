/**
 * NotificationService.js
 * 
 * This service handles sending notifications to users based on their preferences.
 * In a real application, this would connect to backend services for email, SMS, and WhatsApp.
 */

// Activity types
export const ActivityTypes = {
  LOGIN: 0,
  LOGOUT: 1,
  SEARCH: 2,
  CREATE: 3,
  UPDATE: 4,
  DELETE: 5,
  LIKE: 6,
  UNLIKE: 7
};

// Notification channels
export const NotificationChannels = {
  NONE: 0,
  EMAIL: 1,
  SMS: 2,
  WHATSAPP: 3,
  ALL: 4
};

// Mock function to simulate sending email
const sendEmail = async (to, subject, message) => {
  console.log(`📧 SENDING EMAIL to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
};

// Mock function to simulate sending SMS
const sendSMS = async (to, message) => {
  console.log(`📱 SENDING SMS to ${to}`);
  console.log(`Message: ${message}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { success: true };
};

// Mock function to simulate sending WhatsApp message
const sendWhatsApp = async (to, message) => {
  console.log(`💬 SENDING WHATSAPP to ${to}`);
  console.log(`Message: ${message}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return { success: true };
};

/**
 * Send notification based on user preferences
 * @param {Object} user - User object with address, email, and phone
 * @param {number} activityType - Type of activity (from ActivityTypes enum)
 * @param {number} preferredChannel - Preferred notification channel (from NotificationChannels enum)
 * @param {string} message - Notification message
 * @returns {Promise<Object>} - Result of notification sending
 */
const sendNotification = async (user, activityType, preferredChannel, message) => {
  // Validate user data
  if (!user || !user.address) {
    console.error('Invalid user data');
    return { success: false, error: 'Invalid user data' };
  }
  
  // Get activity name for the subject
  let activityName = 'Activity';
  switch (activityType) {
    case ActivityTypes.LOGIN:
      activityName = 'Login';
      break;
    case ActivityTypes.LOGOUT:
      activityName = 'Logout';
      break;
    case ActivityTypes.SEARCH:
      activityName = 'Search';
      break;
    case ActivityTypes.CREATE:
      activityName = 'Content Creation';
      break;
    case ActivityTypes.UPDATE:
      activityName = 'Content Update';
      break;
    case ActivityTypes.DELETE:
      activityName = 'Content Deletion';
      break;
    case ActivityTypes.LIKE:
      activityName = 'Content Like';
      break;
    case ActivityTypes.UNLIKE:
      activityName = 'Content Unlike';
      break;
    default:
      activityName = 'Activity';
  }
  
  const subject = `UGC Tracker: ${activityName} Notification`;
  
  try {
    // Send notifications based on preferred channel
    if (preferredChannel === NotificationChannels.NONE) {
      console.log('Notifications disabled for this activity type');
      return { success: true, message: 'Notifications disabled for this activity type' };
    }
    
    if (preferredChannel === NotificationChannels.EMAIL || preferredChannel === NotificationChannels.ALL) {
      if (!user.email) {
        console.warn('Email notification requested but no email provided');
      } else {
        await sendEmail(user.email, subject, message);
      }
    }
    
    if (preferredChannel === NotificationChannels.SMS || preferredChannel === NotificationChannels.ALL) {
      if (!user.phone) {
        console.warn('SMS notification requested but no phone number provided');
      } else {
        await sendSMS(user.phone, message);
      }
    }
    
    if (preferredChannel === NotificationChannels.WHATSAPP || preferredChannel === NotificationChannels.ALL) {
      if (!user.phone) {
        console.warn('WhatsApp notification requested but no phone number provided');
      } else {
        await sendWhatsApp(user.phone, message);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Track user activity and send notification if needed
 * @param {Object} user - User object with address, email, and phone
 * @param {number} activityType - Type of activity (from ActivityTypes enum)
 * @param {number} preferredChannel - Preferred notification channel (from NotificationChannels enum)
 * @param {Object} data - Additional data related to the activity
 * @returns {Promise<Object>} - Result of activity tracking and notification
 */
const trackActivity = async (user, activityType, preferredChannel, data = {}) => {
  try {
    // Construct message based on activity type
    let message = '';
    
    switch (activityType) {
      case ActivityTypes.LOGIN:
        message = `Login detected for account ${user.address.substring(0, 6)}...${user.address.substring(38)} at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.LOGOUT:
        message = `Logout detected for account ${user.address.substring(0, 6)}...${user.address.substring(38)} at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.SEARCH:
        message = `Search performed with query: "${data.query}" at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.CREATE:
        message = `New content created with ID: ${data.contentId} at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.UPDATE:
        message = `Content updated with ID: ${data.contentId} at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.DELETE:
        message = `Content deleted with ID: ${data.contentId} at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.LIKE:
        message = `Content liked with ID: ${data.contentId} at ${new Date().toLocaleString()}`;
        break;
      case ActivityTypes.UNLIKE:
        message = `Content unliked with ID: ${data.contentId} at ${new Date().toLocaleString()}`;
        break;
      default:
        message = `Activity detected for account ${user.address} at ${new Date().toLocaleString()}`;
    }
    
    // Log activity (in a real app, this would be stored in a database or blockchain)
    console.log(`🔍 ACTIVITY TRACKED: ${message}`);
    
    // Send notification
    const notificationResult = await sendNotification(user, activityType, preferredChannel, message);
    
    return {
      success: true,
      activityLogged: true,
      notificationSent: notificationResult.success,
      message: message
    };
  } catch (error) {
    console.error('Error tracking activity:', error);
    return { success: false, error: error.message };
  }
};

// Export the service
export default {
  ActivityTypes,
  NotificationChannels,
  sendNotification,
  trackActivity
}; 