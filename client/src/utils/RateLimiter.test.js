import RateLimiter from './RateLimiter';

describe('RateLimiter', () => {
  let rateLimiter;
  
  beforeEach(() => {
    // Create a new rate limiter for each test with a small window
    rateLimiter = new RateLimiter({
      maxRequests: 3,
      windowMs: 1000, // 1 second window for faster testing
      message: 'Rate limit exceeded'
    });
  });
  
  it('should allow requests within the rate limit', () => {
    const key = 'user1';
    
    // First request
    const result1 = rateLimiter.check(key);
    expect(result1.allowed).toBe(true);
    expect(result1.current).toBe(1);
    expect(result1.remaining).toBe(2);
    
    // Second request
    const result2 = rateLimiter.check(key);
    expect(result2.allowed).toBe(true);
    expect(result2.current).toBe(2);
    expect(result2.remaining).toBe(1);
    
    // Third request
    const result3 = rateLimiter.check(key);
    expect(result3.allowed).toBe(true);
    expect(result3.current).toBe(3);
    expect(result3.remaining).toBe(0);
  });
  
  it('should block requests that exceed the rate limit', () => {
    const key = 'user2';
    
    // Make 3 requests (up to the limit)
    rateLimiter.check(key);
    rateLimiter.check(key);
    rateLimiter.check(key);
    
    // Fourth request should be blocked
    const result = rateLimiter.check(key);
    expect(result.allowed).toBe(false);
    expect(result.current).toBe(3);
    expect(result.remaining).toBe(0);
    expect(result.message).toBe('Rate limit exceeded');
  });
  
  it('should reset the counter after the time window', async () => {
    const key = 'user3';
    
    // Make 3 requests (up to the limit)
    rateLimiter.check(key);
    rateLimiter.check(key);
    rateLimiter.check(key);
    
    // Fourth request should be blocked
    const blockedResult = rateLimiter.check(key);
    expect(blockedResult.allowed).toBe(false);
    
    // Wait for the time window to pass
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // After the window, requests should be allowed again
    const allowedResult = rateLimiter.check(key);
    expect(allowedResult.allowed).toBe(true);
    expect(allowedResult.current).toBe(1);
    expect(allowedResult.remaining).toBe(2);
  });
  
  it('should track different keys separately', () => {
    const key1 = 'user4';
    const key2 = 'user5';
    
    // Make 3 requests for key1
    rateLimiter.check(key1);
    rateLimiter.check(key1);
    rateLimiter.check(key1);
    
    // key1 should be blocked
    const blockedResult = rateLimiter.check(key1);
    expect(blockedResult.allowed).toBe(false);
    
    // key2 should still be allowed
    const allowedResult = rateLimiter.check(key2);
    expect(allowedResult.allowed).toBe(true);
  });
  
  it('should clear all rate limit data', () => {
    const key = 'user6';
    
    // Make 3 requests
    rateLimiter.check(key);
    rateLimiter.check(key);
    rateLimiter.check(key);
    
    // Clear all data
    rateLimiter.clear();
    
    // Should be allowed again
    const result = rateLimiter.check(key);
    expect(result.allowed).toBe(true);
    expect(result.current).toBe(1);
  });
  
  it('should remove rate limit data for a specific key', () => {
    const key1 = 'user7';
    const key2 = 'user8';
    
    // Make requests for both keys
    rateLimiter.check(key1);
    rateLimiter.check(key1);
    rateLimiter.check(key2);
    
    // Remove data for key1
    rateLimiter.remove(key1);
    
    // key1 should be reset
    const key1Result = rateLimiter.check(key1);
    expect(key1Result.current).toBe(1);
    
    // key2 should still have its count
    const key2Result = rateLimiter.check(key2);
    expect(key2Result.current).toBe(2);
  });
  
  it('should return the current status for a key', () => {
    const key = 'user9';
    
    // Make 2 requests
    rateLimiter.check(key);
    rateLimiter.check(key);
    
    // Get status
    const status = rateLimiter.getStatus(key);
    expect(status.current).toBe(2);
    expect(status.max).toBe(3);
    expect(status.remaining).toBe(1);
    expect(status.timeRemaining).toBeGreaterThan(0);
  });
  
  it('should return null status for a non-existent key', () => {
    const status = rateLimiter.getStatus('nonexistent');
    expect(status).toBeNull();
  });
}); 