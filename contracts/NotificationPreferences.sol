// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NotificationPreferences
 * @dev Contract for managing user notification preferences
 */
contract NotificationPreferences is Ownable {
    // Notification channels
    enum Channel { None, Email, SMS, WhatsApp, All }
    
    // Activity types
    enum ActivityType { Login, Logout, Search, Create, Update, Delete, Like, Unlike }
    
    // Struct to store user notification preferences
    struct UserPreference {
        address user;
        mapping(ActivityType => Channel) activityPreferences;
        string email;
        string phone;
        bool isActive;
    }
    
    // Mapping from user address to their notification preferences
    mapping(address => UserPreference) public userPreferences;
    
    // Array of registered users
    address[] public registeredUsers;
    
    // Events
    event UserRegistered(address indexed user, string email, string phone);
    event PreferenceUpdated(address indexed user, uint8 activityType, uint8 channel);
    event ContactInfoUpdated(address indexed user, string email, string phone);
    event NotificationSent(address indexed user, uint8 activityType, uint8 channel);
    
    /**
     * @dev Register a new user with notification preferences
     * @param _email User's email address
     * @param _phone User's phone number
     */
    function registerUser(string memory _email, string memory _phone) public {
        require(!userPreferences[msg.sender].isActive, "User already registered");
        
        UserPreference storage newUser = userPreferences[msg.sender];
        newUser.user = msg.sender;
        newUser.email = _email;
        newUser.phone = _phone;
        newUser.isActive = true;
        
        // Set default preferences (Email for all activities)
        for (uint8 i = 0; i < 8; i++) {
            newUser.activityPreferences[ActivityType(i)] = Channel.Email;
        }
        
        registeredUsers.push(msg.sender);
        
        emit UserRegistered(msg.sender, _email, _phone);
    }
    
    /**
     * @dev Update notification preference for a specific activity
     * @param _activityType Type of activity
     * @param _channel Preferred notification channel
     */
    function updatePreference(ActivityType _activityType, Channel _channel) public {
        require(userPreferences[msg.sender].isActive, "User not registered");
        
        userPreferences[msg.sender].activityPreferences[_activityType] = _channel;
        
        emit PreferenceUpdated(msg.sender, uint8(_activityType), uint8(_channel));
    }
    
    /**
     * @dev Update user contact information
     * @param _email New email address
     * @param _phone New phone number
     */
    function updateContactInfo(string memory _email, string memory _phone) public {
        require(userPreferences[msg.sender].isActive, "User not registered");
        
        userPreferences[msg.sender].email = _email;
        userPreferences[msg.sender].phone = _phone;
        
        emit ContactInfoUpdated(msg.sender, _email, _phone);
    }
    
    /**
     * @dev Get user's preferred channel for a specific activity
     * @param _user User address
     * @param _activityType Type of activity
     * @return Preferred notification channel
     */
    function getPreferredChannel(address _user, ActivityType _activityType) public view returns (Channel) {
        require(userPreferences[_user].isActive, "User not registered");
        
        return userPreferences[_user].activityPreferences[_activityType];
    }
    
    /**
     * @dev Get user's contact information
     * @param _user User address
     * @return email User's email address
     * @return phone User's phone number
     */
    function getContactInfo(address _user) public view returns (string memory email, string memory phone) {
        require(userPreferences[_user].isActive, "User not registered");
        
        return (userPreferences[_user].email, userPreferences[_user].phone);
    }
    
    /**
     * @dev Check if a user is registered
     * @param _user User address
     * @return Whether the user is registered
     */
    function isUserRegistered(address _user) public view returns (bool) {
        return userPreferences[_user].isActive;
    }
    
    /**
     * @dev Get total number of registered users
     * @return Total user count
     */
    function getTotalUserCount() public view returns (uint256) {
        return registeredUsers.length;
    }
    
    /**
     * @dev Trigger a notification (only callable by owner or authorized contracts)
     * @param _user User to notify
     * @param _activityType Type of activity
     * @param _data Additional data for the notification
     */
    function triggerNotification(address _user, ActivityType _activityType, string memory _data) public onlyOwner {
        require(userPreferences[_user].isActive, "User not registered");
        
        Channel preferredChannel = userPreferences[_user].activityPreferences[_activityType];
        
        // If channel is None, don't send notification
        if (preferredChannel == Channel.None) {
            return;
        }
        
        // In a real implementation, this would integrate with external notification services
        // For now, we just emit an event
        emit NotificationSent(_user, uint8(_activityType), uint8(preferredChannel));
    }
} 