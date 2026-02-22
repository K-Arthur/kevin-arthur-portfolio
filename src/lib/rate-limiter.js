/**
 * Rate Limiter - In-memory rate limiting for API endpoints
 * 
 * Limits requests based on IP address and endpoint
 * Tracks suspicious activity and logs violations
 */

// In-memory storage for rate limits (in production, use Redis or similar)
const rateLimitStore = new Map();

// Rate limit configurations
const RATE_LIMITS = {
  'subscribe': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    message: 'Too many subscription attempts. Please try again later.',
  },
  'generate-checklist-pdf': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many PDF generation requests. Please try again later.',
  },
  'send-nurture-email': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many email requests. Please try again later.',
  },
  'default': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests. Please slow down.',
  },
};

// Suspicious activity tracking
const suspiciousActivity = new Map();

/**
 * Get client IP address from request
 */
function getClientIP(request) {
  // Try various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  // Fallback to a default
  return 'unknown';
}

/**
 * Get rate limit key for a request
 */
function getRateLimitKey(ip, endpoint) {
  return `${ip}:${endpoint}`;
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(ip, endpoint) {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
  const key = getRateLimitKey(ip, endpoint);
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
      firstRequest: now,
    };
    rateLimitStore.set(key, entry);
  }
  
  // Reset if window has expired
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + config.windowMs;
    entry.firstRequest = now;
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    // Track suspicious activity
    trackSuspiciousActivity(ip, endpoint, entry);
    
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      message: config.message,
    };
  }
  
  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Track suspicious activity
 */
function trackSuspiciousActivity(ip, endpoint, entry) {
  const key = `${ip}:${endpoint}`;
  let activity = suspiciousActivity.get(key);
  
  if (!activity) {
    activity = {
      ip,
      endpoint,
      violations: 0,
      firstViolation: Date.now(),
      lastViolation: Date.now(),
      details: [],
    };
  }
  
  activity.violations++;
  activity.lastViolation = Date.now();
  activity.details.push({
    timestamp: new Date().toISOString(),
    count: entry.count,
    limit: RATE_LIMITS[endpoint]?.maxRequests || RATE_LIMITS['default'].maxRequests,
  });
  
  // Keep only last 10 violations
  if (activity.details.length > 10) {
    activity.details = activity.details.slice(-10);
  }
  
  suspiciousActivity.set(key, activity);
  
  // Log suspicious activity
  console.warn('🚨 Suspicious activity detected:', {
    ip,
    endpoint,
    violations: activity.violations,
    details: activity.details,
  });
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result) {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };
}

/**
 * Clear old rate limit entries (call periodically)
 */
export function cleanupOldEntries() {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime + (60 * 60 * 1000)) { // 1 hour after reset
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => rateLimitStore.delete(key));
  
  // Also clean up suspicious activity older than 24 hours
  const suspiciousKeysToDelete = [];
  for (const [key, activity] of suspiciousActivity.entries()) {
    if (now - activity.lastViolation > (24 * 60 * 60 * 1000)) {
      suspiciousKeysToDelete.push(key);
    }
  }
  
  suspiciousKeysToDelete.forEach(key => suspiciousActivity.delete(key));
  
  return {
    rateLimitEntriesCleared: keysToDelete.length,
    suspiciousEntriesCleared: suspiciousKeysToDelete.length,
  };
}

/**
 * Get suspicious activity report
 */
export function getSuspiciousActivityReport() {
  const report = [];
  
  for (const [key, activity] of suspiciousActivity.entries()) {
    report.push({
      ip: activity.ip,
      endpoint: activity.endpoint,
      violations: activity.violations,
      firstViolation: new Date(activity.firstViolation).toISOString(),
      lastViolation: new Date(activity.lastViolation).toISOString(),
      recentDetails: activity.details.slice(-3),
    });
  }
  
  // Sort by most recent violations
  report.sort((a, b) => new Date(b.lastViolation) - new Date(a.lastViolation));
  
  return report;
}

/**
 * Middleware factory for Next.js API routes
 */
export function createRateLimitMiddleware(endpoint) {
  return async function rateLimitMiddleware(request) {
    const ip = getClientIP(request);
    const result = checkRateLimit(ip, endpoint);
    
    return {
      allowed: result.allowed,
      headers: getRateLimitHeaders(result),
      message: result.message,
    };
  };
}

// Cleanup old entries every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = cleanupOldEntries();
    if (cleaned.rateLimitEntriesCleared > 0 || cleaned.suspiciousEntriesCleared > 0) {
      console.log('🧹 Rate limiter cleanup:', cleaned);
    }
  }, 60 * 60 * 1000); // Every hour
}
