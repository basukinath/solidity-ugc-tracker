import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import MockActionGenerator from '../utils/MockActionGenerator';

const RateLimitDemo = ({ account }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [actionCount, setActionCount] = useState(5);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch rate limit status
  const fetchRateLimitStatus = () => {
    if (account) {
      const status = NotificationService.getRateLimitStatus(account);
      setRateLimitStatus(status);
    }
  };

  // Effect to refresh rate limit status periodically if auto-refresh is enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchRateLimitStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, account]);

  // Generate random actions
  const handleGenerateActions = async () => {
    setLoading(true);
    const newResults = [];
    
    try {
      // Generate multiple random actions
      const actionResults = await MockActionGenerator.generateMultipleRandomActions(actionCount);
      
      // Add results to the list
      for (const result of actionResults) {
        newResults.push({
          timestamp: new Date().toISOString(),
          success: result.success,
          message: result.message,
          rateLimited: result.rateLimited,
          error: result.error
        });
      }
      
      // Update results and rate limit status
      setResults(prev => [...newResults, ...prev].slice(0, 50));
      fetchRateLimitStatus();
    } catch (error) {
      console.error('Error generating actions:', error);
      newResults.push({
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset rate limits for the current user
  const handleResetRateLimits = () => {
    if (account) {
      NotificationService.resetRateLimits(account);
      fetchRateLimitStatus();
      setResults([{
        timestamp: new Date().toISOString(),
        success: true,
        message: 'Rate limits have been reset'
      }, ...results]);
    }
  };

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (!ms) return 'N/A';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="rate-limit-demo">
      <h2>Rate Limiting Demo</h2>
      <p>
        This demo shows how rate limiting works in the notification system. 
        Generate random actions to see how the rate limits are applied.
      </p>
      
      <div className="demo-controls">
        <div className="form-group">
          <label htmlFor="actionCount">Number of Actions:</label>
          <input
            type="number"
            id="actionCount"
            min="1"
            max="20"
            value={actionCount}
            onChange={(e) => setActionCount(parseInt(e.target.value))}
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh rate limit status
          </label>
        </div>
        
        <div className="button-group">
          <button 
            className="btn btn-primary"
            onClick={handleGenerateActions}
            disabled={loading}
          >
            {loading ? 'Generating...' : `Generate ${actionCount} Random Actions`}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={handleResetRateLimits}
            disabled={loading}
          >
            Reset Rate Limits
          </button>
          
          <button 
            className="btn btn-info"
            onClick={fetchRateLimitStatus}
            disabled={loading}
          >
            Refresh Status
          </button>
        </div>
      </div>
      
      {rateLimitStatus && (
        <div className="rate-limit-status">
          <h3>Rate Limit Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <h4>Activity Tracking</h4>
              <p>Current: {rateLimitStatus.activity?.current || 0}</p>
              <p>Limit: {rateLimitStatus.activity?.max || 50}</p>
              <p>Remaining: {rateLimitStatus.activity?.remaining || 50}</p>
              <p>Reset in: {formatTimeRemaining(rateLimitStatus.activity?.timeRemaining)}</p>
            </div>
            
            <div className="status-item">
              <h4>Email Notifications</h4>
              <p>Current: {rateLimitStatus.email?.current || 0}</p>
              <p>Limit: {rateLimitStatus.email?.max || 10}</p>
              <p>Remaining: {rateLimitStatus.email?.remaining || 10}</p>
              <p>Reset in: {formatTimeRemaining(rateLimitStatus.email?.timeRemaining)}</p>
            </div>
            
            <div className="status-item">
              <h4>SMS Notifications</h4>
              <p>Current: {rateLimitStatus.sms?.current || 0}</p>
              <p>Limit: {rateLimitStatus.sms?.max || 5}</p>
              <p>Remaining: {rateLimitStatus.sms?.remaining || 5}</p>
              <p>Reset in: {formatTimeRemaining(rateLimitStatus.sms?.timeRemaining)}</p>
            </div>
            
            <div className="status-item">
              <h4>WhatsApp Notifications</h4>
              <p>Current: {rateLimitStatus.whatsapp?.current || 0}</p>
              <p>Limit: {rateLimitStatus.whatsapp?.max || 5}</p>
              <p>Remaining: {rateLimitStatus.whatsapp?.remaining || 5}</p>
              <p>Reset in: {formatTimeRemaining(rateLimitStatus.whatsapp?.timeRemaining)}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="action-results">
        <h3>Action Results</h3>
        {results.length === 0 ? (
          <p className="no-results">No actions generated yet. Click the button above to generate random actions.</p>
        ) : (
          <div className="results-list">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`result-item ${result.success ? 'success' : 'error'} ${result.rateLimited ? 'rate-limited' : ''}`}
              >
                <div className="result-time">{formatDate(result.timestamp)}</div>
                <div className="result-content">
                  {result.success ? (
                    <span className="success-icon">✓</span>
                  ) : (
                    <span className="error-icon">✗</span>
                  )}
                  {result.rateLimited && <span className="rate-limited-badge">Rate Limited</span>}
                  <p>{result.message || result.error}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="demo-info">
        <h3>Rate Limit Information</h3>
        <ul>
          <li><strong>Activity Tracking:</strong> Limited to 50 activities per hour per user</li>
          <li><strong>Email Notifications:</strong> Limited to 10 emails per hour per user</li>
          <li><strong>SMS Notifications:</strong> Limited to 5 SMS messages per hour per user</li>
          <li><strong>WhatsApp Notifications:</strong> Limited to 5 WhatsApp messages per hour per user</li>
        </ul>
        <p>
          In a production environment, these limits would be configurable and could be adjusted based on user roles,
          subscription levels, or other factors. The rate limits help prevent abuse of the notification system and
          ensure fair usage of resources.
        </p>
      </div>
    </div>
  );
};

export default RateLimitDemo; 