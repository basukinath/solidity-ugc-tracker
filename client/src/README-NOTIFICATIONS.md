# Notification System Documentation

## Overview

The notification system in the UGC Tracker application allows users to receive notifications about various activities that occur within the application. This system is designed to be flexible, allowing users to choose which activities they want to be notified about and through which channels they prefer to receive these notifications.

## Components

The notification system consists of the following components:

1. **NotificationService**: A service that handles sending notifications through various channels.
2. **NotificationPreferences**: A component that allows users to set their notification preferences.
3. **ActivityDemo**: A component that demonstrates how the notification system works.

## Activity Types

The system tracks the following types of activities:

- **LOGIN**: User login events
- **LOGOUT**: User logout events
- **SEARCH**: Content search events
- **CREATE**: Content creation events
- **UPDATE**: Content update events
- **DELETE**: Content deletion events
- **LIKE**: Content like events
- **UNLIKE**: Content unlike events

## Notification Channels

Notifications can be sent through the following channels:

- **NONE**: No notifications
- **EMAIL**: Email notifications
- **SMS**: SMS notifications
- **WHATSAPP**: WhatsApp notifications
- **ALL**: All available channels

## How It Works

1. When a user performs an action in the application, the system tracks this activity using the `trackActivity` function in the `NotificationService`.
2. The system checks the user's notification preferences to determine if they want to be notified about this type of activity.
3. If the user has enabled notifications for this activity type, the system sends a notification through the user's preferred channel(s).

## Implementation Details

### NotificationService

The `NotificationService` provides the following functionality:

- `ActivityTypes`: An enumeration of all possible activity types.
- `NotificationChannels`: An enumeration of all possible notification channels.
- `sendNotification`: A function that sends notifications through various channels.
- `trackActivity`: A function that tracks user activities and sends notifications if needed.

### NotificationPreferences

The `NotificationPreferences` component allows users to:

- Register for notifications by providing their email and phone number.
- Set their notification preferences for each activity type.
- Choose their preferred notification channel for each activity type.

### ActivityDemo

The `ActivityDemo` component demonstrates how the notification system works by:

- Allowing users to simulate different types of activities.
- Showing how notifications are sent based on user preferences.
- Providing a visual representation of the notification process.

## Integration with Smart Contract

In a production environment, the notification system would be integrated with the smart contract to:

1. Store user notification preferences on the blockchain.
2. Track user activities through smart contract events.
3. Trigger notifications based on smart contract events.

## Future Enhancements

Potential future enhancements to the notification system include:

1. **Push Notifications**: Adding support for browser push notifications.
2. **In-App Notifications**: Implementing an in-app notification center.
3. **Notification History**: Storing a history of notifications for each user.
4. **Notification Templates**: Creating customizable notification templates.
5. **Batch Notifications**: Grouping similar notifications to reduce notification fatigue.

## Testing the Notification System

To test the notification system:

1. Navigate to the Activity Demo page.
2. Enter your email and phone number.
3. Select an activity type and notification channel.
4. Click the "Trigger Activity & Notification" button.
5. Check the browser console to see the simulated notification.

## Note

In this demo application, notifications are simulated and logged to the browser console. In a production environment, these would be sent through actual email, SMS, and WhatsApp services. 