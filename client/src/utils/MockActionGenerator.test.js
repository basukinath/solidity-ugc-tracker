import { generateRandomAction, generateMultipleRandomActions } from './MockActionGenerator';
import NotificationService, { ActivityTypes, NotificationChannels } from '../services/NotificationService';

// Mock the NotificationService
jest.mock('../services/NotificationService', () => {
  const originalModule = jest.requireActual('../services/NotificationService');
  
  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      trackActivity: jest.fn().mockResolvedValue({ success: true, activityLogged: true, notificationSent: true })
    }
  };
});

describe('MockActionGenerator', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should generate a random action and trigger a notification', async () => {
    // Call the function to generate a random action
    const result = await generateRandomAction();

    // Verify that trackActivity was called
    expect(NotificationService.trackActivity).toHaveBeenCalled();
    
    // Verify the result
    expect(result).toEqual({
      success: true,
      activityLogged: true,
      notificationSent: true
    });
  });

  it('should generate multiple random actions', async () => {
    // Call the function to generate 3 random actions
    const results = await generateMultipleRandomActions(3);

    // Verify that trackActivity was called 3 times
    expect(NotificationService.trackActivity).toHaveBeenCalledTimes(3);
    
    // Verify the results
    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({
      success: true,
      activityLogged: true,
      notificationSent: true
    });
  });

  it('should include appropriate data for search actions', async () => {
    // Mock Math.random to always return a value that will select the SEARCH activity
    const originalRandom = Math.random;
    Math.random = jest.fn()
      .mockReturnValueOnce(0.1) // For user selection
      .mockReturnValueOnce(0.3) // For activity type (SEARCH)
      .mockReturnValueOnce(0.1) // For notification channel
      .mockReturnValueOnce(0.1); // For search query

    await generateRandomAction();

    // Restore Math.random
    Math.random = originalRandom;

    // Get the call arguments
    const callArgs = NotificationService.trackActivity.mock.calls[0];
    
    // Verify that data contains a query
    expect(callArgs[3]).toHaveProperty('query');
  });

  it('should include appropriate data for content-related actions', async () => {
    // Mock Math.random to always return a value that will select the CREATE activity
    const originalRandom = Math.random;
    Math.random = jest.fn()
      .mockReturnValueOnce(0.1) // For user selection
      .mockReturnValueOnce(0.4) // For activity type (CREATE)
      .mockReturnValueOnce(0.1) // For notification channel
      .mockReturnValueOnce(0.1); // For content ID

    await generateRandomAction();

    // Restore Math.random
    Math.random = originalRandom;

    // Get the call arguments
    const callArgs = NotificationService.trackActivity.mock.calls[0];
    
    // Verify that data contains a contentId
    expect(callArgs[3]).toHaveProperty('contentId');
  });
}); 