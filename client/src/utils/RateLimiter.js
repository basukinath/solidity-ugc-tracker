/**
 * A simple in-memory rate limiter for client-side applications
 * This can be used to limit the frequency of certain actions
 */
class RateLimiter {
  constructor(options = {}) {
    // Maximum number of requests allowed in the time window
    this.maxRequests = options.maxRequests || 10;
    
    // Time window in milliseconds (default: 1 minute)
    this.windowMs = options.windowMs || 60 * 1000;
    
    // Store for tracking requests
    this.store = new Map();
    
    // Message to return when rate limit is exceeded
    this.message = options.message || 'Too many requests, please try again later.';
  }

  /**
   * Check if a key has exceeded the rate limit
   * @param {string} key - The key to check (e.g., user ID, IP address)
   * @returns {Object} - Result object with allowed flag and reset time
   */
  check(key) {
    const now = Date.now();
    
    // Get or create record for this key
    if (!this.store.has(key)) {
      this.store.set(key, {
        count: 0,
        resetTime: now + this.windowMs
      });
    }
    
    const record = this.store.get(key);
    
    // If the reset time has passed, reset the counter
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + this.windowMs;
    }
    
    // Check if the rate limit has been exceeded
    const allowed = record.count < this.maxRequests;
    
    // Increment the counter if not exceeded
    if (allowed) {
      record.count++;
    }
    
    return {
      allowed,
      current: record.count,
      max: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - record.count),
      resetTime: record.resetTime,
      message: allowed ? null : this.message
    };
  }

  /**
   * Clear all rate limit data
   */
  clear() {
    this.store.clear();
  }

  /**
   * Remove rate limit data for a specific key
   * @param {string} key - The key to remove
   */
  remove(key) {
    this.store.delete(key);
  }

  /**
   * Get the current rate limit status for a key
   * @param {string} key - The key to check
   * @returns {Object|null} - The rate limit status or null if not found
   */
  getStatus(key) {
    if (!this.store.has(key)) {
      return null;
    }
    
    const record = this.store.get(key);
    const now = Date.now();
    
    return {
      current: record.count,
      max: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - record.count),
      resetTime: record.resetTime,
      timeRemaining: Math.max(0, record.resetTime - now)
    };
  }
}

export default RateLimiter; 