# Rate Limiting and Mock Actions Documentation

## Overview

This document provides information about the rate limiting and mock action generation features implemented in the UGC Tracker application. These features help prevent abuse of the notification system and provide a way to test the system with simulated user actions.

## Rate Limiting

Rate limiting is a technique used to control the amount of incoming and outgoing traffic to or from a network, application, or service. In the context of the UGC Tracker application, rate limiting is used to:

1. Prevent abuse of the notification system
2. Ensure fair usage of resources
3. Protect external services from being overwhelmed

### Implementation

The rate limiting system in UGC Tracker is implemented using a client-side utility called `RateLimiter`. This utility:

- Tracks the number of requests made by each user
- Enforces limits based on configurable thresholds
- Resets counters after a specified time window

### Rate Limits

The following rate limits are implemented:

| Service | Limit | Time Window |
|---------|-------|-------------|
| Activity Tracking | 50 activities | 1 hour |
| Email Notifications | 10 emails | 1 hour |
| SMS Notifications | 5 SMS messages | 1 hour |
| WhatsApp Notifications | 5 WhatsApp messages | 1 hour |

### How It Works

1. When a user performs an action that triggers a notification, the system checks if the user has exceeded their rate limit for that type of notification.
2. If the user is within the limit, the notification is sent and the counter is incremented.
3. If the user has exceeded the limit, the notification is not sent and an error message is returned.
4. Counters are automatically reset after the specified time window (e.g., 1 hour).

### Rate Limit Demo

The application includes a Rate Limit Demo component that allows you to:

- Generate random actions to see how rate limiting works
- View your current rate limit status
- Reset your rate limits for testing purposes

## Mock Action Generator

The Mock Action Generator is a utility that simulates user actions for testing purposes. It can generate various types of actions, such as:

- Login/Logout events
- Content creation, update, and deletion
- Content likes and unlikes
- Search queries

### Implementation

The Mock Action Generator is implemented in the `MockActionGenerator.js` file. It provides functions to:

- Generate a single random action
- Generate multiple random actions
- Customize the data associated with each action

### How It Works

1. The generator selects a random user, activity type, and notification channel.
2. It prepares appropriate data based on the activity type (e.g., content ID for content-related actions, search query for search actions).
3. It calls the `trackActivity` function in the `NotificationService` to track the activity and send notifications.
4. The results are returned, including information about whether the notification was sent or rate-limited.

### Testing with Mock Actions

You can use the Mock Action Generator to test various aspects of the notification system:

- Test how different types of activities are tracked
- Test how notifications are sent through different channels
- Test how rate limiting affects notification delivery

## Integration with Java-based AI

In a production environment, the rate limiting and mock action generation features could be integrated with a Java-based AI system to:

1. Analyze user behavior patterns
2. Detect unusual activity that might indicate abuse
3. Dynamically adjust rate limits based on user behavior
4. Generate realistic mock actions for testing and training the AI

### Potential AI Features

- **Anomaly Detection**: Identify unusual patterns of activity that might indicate abuse or security issues.
- **User Behavior Analysis**: Analyze how users interact with the system to improve the user experience.
- **Predictive Rate Limiting**: Adjust rate limits based on predicted user behavior.
- **Smart Notification Routing**: Use AI to determine the best channel for each notification based on user preferences and behavior.

## Conclusion

The rate limiting and mock action generation features provide important protections for the UGC Tracker application and its users. They help ensure fair usage of resources, prevent abuse, and provide a way to test the system with simulated user actions. In a production environment, these features could be further enhanced with Java-based AI to provide more sophisticated analysis and protection. 