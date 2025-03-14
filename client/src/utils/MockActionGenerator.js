import NotificationService, { ActivityTypes, NotificationChannels } from '../services/NotificationService';

// Sample mock users for testing
const mockUsers = [
  { 
    address: '0x1234567890123456789012345678901234567890', 
    email: 'user1@example.com', 
    phone: '+1234567890' 
  },
  { 
    address: '0x0987654321098765432109876543210987654321', 
    email: 'user2@example.com', 
    phone: '+0987654321' 
  },
  { 
    address: '0x5678901234567890123456789012345678901234', 
    email: 'user3@example.com', 
    phone: '+5678901234' 
  }
];

// Sample content IDs for content-related actions
const contentIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// Sample search queries for search actions
const searchQueries = [
  'blockchain',
  'ethereum',
  'solidity',
  'smart contract',
  'decentralized',
  'web3',
  'cryptocurrency',
  'NFT',
  'token',
  'DeFi'
];

/**
 * Generate a random user action and trigger a notification
 * @returns {Promise<Object>} The result of the notification
 */
export const generateRandomAction = async () => {
  // Select a random user
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  
  // Select a random activity type
  const activityType = Object.values(ActivityTypes)[
    Math.floor(Math.random() * Object.values(ActivityTypes).length)
  ];
  
  // Select a random notification channel
  const channel = Object.values(NotificationChannels)[
    Math.floor(Math.random() * Object.values(NotificationChannels).length)
  ];

  // Prepare data based on activity type
  const data = {};
  if (activityType === ActivityTypes.SEARCH) {
    data.query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
  } else if ([
    ActivityTypes.CREATE, 
    ActivityTypes.UPDATE, 
    ActivityTypes.DELETE, 
    ActivityTypes.LIKE, 
    ActivityTypes.UNLIKE
  ].includes(activityType)) {
    data.contentId = contentIds[Math.floor(Math.random() * contentIds.length)];
  }

  console.log(`[MOCK] Generating random action for user: ${user.address.substring(0, 6)}...`);
  console.log(`[MOCK] Activity Type: ${getActivityName(activityType)}`);
  console.log(`[MOCK] Notification Channel: ${getChannelName(channel)}`);
  
  // Track the activity and send notification
  return await NotificationService.trackActivity(user, activityType, channel, data);
};

/**
 * Generate multiple random actions
 * @param {number} count Number of actions to generate
 * @returns {Promise<Array>} Array of notification results
 */
export const generateMultipleRandomActions = async (count = 5) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(await generateRandomAction());
    // Add a small delay between actions to make it more realistic
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return results;
};

/**
 * Get the name of an activity type
 * @param {number} activityType The activity type
 * @returns {string} The name of the activity type
 */
const getActivityName = (activityType) => {
  const names = {
    [ActivityTypes.LOGIN]: 'Login',
    [ActivityTypes.LOGOUT]: 'Logout',
    [ActivityTypes.SEARCH]: 'Search',
    [ActivityTypes.CREATE]: 'Create Content',
    [ActivityTypes.UPDATE]: 'Update Content',
    [ActivityTypes.DELETE]: 'Delete Content',
    [ActivityTypes.LIKE]: 'Like Content',
    [ActivityTypes.UNLIKE]: 'Unlike Content'
  };
  return names[activityType] || 'Unknown Activity';
};

/**
 * Get the name of a notification channel
 * @param {number} channel The notification channel
 * @returns {string} The name of the notification channel
 */
const getChannelName = (channel) => {
  const names = {
    [NotificationChannels.NONE]: 'None',
    [NotificationChannels.EMAIL]: 'Email',
    [NotificationChannels.SMS]: 'SMS',
    [NotificationChannels.WHATSAPP]: 'WhatsApp',
    [NotificationChannels.ALL]: 'All Channels'
  };
  return names[channel] || 'Unknown Channel';
};

export default {
  generateRandomAction,
  generateMultipleRandomActions
}; 