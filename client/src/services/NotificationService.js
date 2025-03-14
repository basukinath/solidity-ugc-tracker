/**
 * NotificationService.js
 * 
 * This service handles sending notifications to users based on their preferences.
 * In a real application, this would connect to backend services for email, SMS, and WhatsApp.
 */

import RateLimiter from '../utils/RateLimiter';

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

// Create rate limiters for different notification channels
const emailRateLimiter = new RateLimiter({
  maxRequests: 10,  // 10 emails per hour
  windowMs: 60 * 60 * 1000,  // 1 hour
  message: 'Email notification rate limit exceeded. Try again later.'
});

const smsRateLimiter = new RateLimiter({
  maxRequests: 5,   // 5 SMS per hour
  windowMs: 60 * 60 * 1000,  // 1 hour
  message: 'SMS notification rate limit exceeded. Try again later.'
});

const whatsappRateLimiter = new RateLimiter({
  maxRequests: 5,   // 5 WhatsApp messages per hour
  windowMs: 60 * 60 * 1000,  // 1 hour
  message: 'WhatsApp notification rate limit exceeded. Try again later.'
});

// Create a rate limiter for overall activity tracking
const activityRateLimiter = new RateLimiter({
  maxRequests: 50,  // 50 activities per hour
  windowMs: 60 * 60 * 1000,  // 1 hour
  message: 'Activity tracking rate limit exceeded. Try again later.'
});

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
    
    const results = {
      email: null,
      sms: null,
      whatsapp: null
    };
    
    if (preferredChannel === NotificationChannels.EMAIL || preferredChannel === NotificationChannels.ALL) {
      if (!user.email) {
        console.warn('Email notification requested but no email provided');
      } else {
        // Check rate limit for email
        const emailRateCheck = emailRateLimiter.check(user.address);
        if (emailRateCheck.allowed) {
          await sendEmail(user.email, subject, message);
          results.email = { success: true };
        } else {
          console.warn(`Email rate limit exceeded for user ${user.address}`);
          results.email = { 
            success: false, 
            error: emailRateCheck.message,
            resetTime: emailRateCheck.resetTime
          };
        }
      }
    }
    
    if (preferredChannel === NotificationChannels.SMS || preferredChannel === NotificationChannels.ALL) {
      if (!user.phone) {
        console.warn('SMS notification requested but no phone number provided');
      } else {
        // Check rate limit for SMS
        const smsRateCheck = smsRateLimiter.check(user.address);
        if (smsRateCheck.allowed) {
          await sendSMS(user.phone, message);
          results.sms = { success: true };
        } else {
          console.warn(`SMS rate limit exceeded for user ${user.address}`);
          results.sms = { 
            success: false, 
            error: smsRateCheck.message,
            resetTime: smsRateCheck.resetTime
          };
        }
      }
    }
    
    if (preferredChannel === NotificationChannels.WHATSAPP || preferredChannel === NotificationChannels.ALL) {
      if (!user.phone) {
        console.warn('WhatsApp notification requested but no phone number provided');
      } else {
        // Check rate limit for WhatsApp
        const whatsappRateCheck = whatsappRateLimiter.check(user.address);
        if (whatsappRateCheck.allowed) {
          await sendWhatsApp(user.phone, message);
          results.whatsapp = { success: true };
        } else {
          console.warn(`WhatsApp rate limit exceeded for user ${user.address}`);
          results.whatsapp = { 
            success: false, 
            error: whatsappRateCheck.message,
            resetTime: whatsappRateCheck.resetTime
          };
        }
      }
    }
    
    // Determine overall success
    const anySuccess = results.email?.success || results.sms?.success || results.whatsapp?.success;
    const allFailed = 
      (results.email && !results.email.success) && 
      (results.sms && !results.sms.success) && 
      (results.whatsapp && !results.whatsapp.success);
    
    return { 
      success: anySuccess, 
      results,
      rateLimited: allFailed
    };
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
    // Check rate limit for activity tracking
    const activityRateCheck = activityRateLimiter.check(user.address);
    if (!activityRateCheck.allowed) {
      console.warn(`Activity tracking rate limit exceeded for user ${user.address}`);
      return { 
        success: false, 
        error: activityRateCheck.message,
        rateLimited: true,
        resetTime: activityRateCheck.resetTime
      };
    }
    
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
      notificationResults: notificationResult.results,
      rateLimited: notificationResult.rateLimited,
      message: message
    };
  } catch (error) {
    console.error('Error tracking activity:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get rate limit status for a user
 * @param {string} userAddress - User's blockchain address
 * @returns {Object} - Rate limit status for different channels
 */
const getRateLimitStatus = (userAddress) => {
  return {
    activity: activityRateLimiter.getStatus(userAddress),
    email: emailRateLimiter.getStatus(userAddress),
    sms: smsRateLimiter.getStatus(userAddress),
    whatsapp: whatsappRateLimiter.getStatus(userAddress)
  };
};

/**
 * Reset rate limits for a user
 * @param {string} userAddress - User's blockchain address
 */
const resetRateLimits = (userAddress) => {
  activityRateLimiter.remove(userAddress);
  emailRateLimiter.remove(userAddress);
  smsRateLimiter.remove(userAddress);
  whatsappRateLimiter.remove(userAddress);
};

// Export the service
export default {
  ActivityTypes,
  NotificationChannels,
  sendNotification,
  trackActivity,
  getRateLimitStatus,
  resetRateLimits
}; 