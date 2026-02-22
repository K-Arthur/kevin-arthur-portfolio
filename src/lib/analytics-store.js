/**
 * Persistent Analytics Store
 * 
 * This module provides a client-side persistent analytics storage system
 * that survives page refreshes and browser restarts using localStorage.
 * 
 * For server-side persistence, we use a file-based system in the API routes.
 */

// LocalStorage key for analytics data
const ANALYTICS_STORAGE_KEY = 'kevin-arthur-analytics';

// Default analytics structure
const DEFAULT_ANALYTICS = {
  pageViews: {
    total: 0,
    byPath: {},
    daily: {},
  },
  uniqueVisitors: {
    total: 0,
    byPath: {},
  },
  formEvents: {
    views: 0,
    starts: 0,
    completions: 0,
    byPath: {},
  },
  pdfDownloads: {
    total: 0,
    byType: {},
  },
  quizEvents: {
    starts: 0,
    completions: 0,
    averageScore: 0,
    totalScore: 0,
  },
  emailCaptures: {
    total: 0,
    bySource: {},
  },
  abTests: {},
  timestamps: {
    firstEvent: null,
    lastEvent: null,
  },
};

/**
 * Get analytics data from localStorage
 * @returns {Object} Analytics data
 */
export function getAnalyticsData() {
  if (typeof window === 'undefined') {
    return DEFAULT_ANALYTICS;
  }

  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_ANALYTICS;
    }

    const data = JSON.parse(stored);
    // Merge with defaults to ensure all fields exist
    return mergeDeep(DEFAULT_ANALYTICS, data);
  } catch (error) {
    console.error('Error reading analytics data:', error);
    return DEFAULT_ANALYTICS;
  }
}

/**
 * Save analytics data to localStorage
 * @param {Object} data - Analytics data to save
 */
export function saveAnalyticsData(data) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving analytics data:', error);
  }
}

/**
 * Track a page view
 * @param {string} path - The page path
 * @param {string} userId - Optional user ID for unique visitor tracking
 */
export function trackPageView(path, userId = null) {
  const data = getAnalyticsData();
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];

  // Update total page views
  data.pageViews.total += 1;

  // Update by path
  if (!data.pageViews.byPath[path]) {
    data.pageViews.byPath[path] = 0;
  }
  data.pageViews.byPath[path] += 1;

  // Update daily stats
  if (!data.pageViews.daily[today]) {
    data.pageViews.daily[today] = 0;
  }
  data.pageViews.daily[today] += 1;

  // Track unique visitors if userId is provided
  if (userId) {
    const visitorKey = `visitor_${userId}_${path}`;
    const hasVisited = localStorage.getItem(visitorKey);

    if (!hasVisited) {
      data.uniqueVisitors.total += 1;

      if (!data.uniqueVisitors.byPath[path]) {
        data.uniqueVisitors.byPath[path] = '';
      }
      // Note: We can't store Set in localStorage, so we use a string
      const visitors = data.uniqueVisitors.byPath[path] || '';
      const visitorSet = visitors ? visitors.split(',') : [];
      if (!visitorSet.includes(userId)) {
        visitorSet.push(userId);
        data.uniqueVisitors.byPath[path] = visitorSet.join(',');
      }

      localStorage.setItem(visitorKey, now);
    }
  }

  // Update timestamps
  if (!data.timestamps.firstEvent) {
    data.timestamps.firstEvent = now;
  }
  data.timestamps.lastEvent = now;

  saveAnalyticsData(data);
}

/**
 * Track a form event
 * @param {string} eventType - 'view', 'start', or 'complete'
 * @param {string} path - The page path where the form is
 */
export function trackFormEvent(eventType, path) {
  const data = getAnalyticsData();
  const now = new Date().toISOString();

  // Update form events
  if (eventType === 'view') {
    data.formEvents.views += 1;
  } else if (eventType === 'start') {
    data.formEvents.starts += 1;
  } else if (eventType === 'complete') {
    data.formEvents.completions += 1;
  }

  // Track by path
  if (!data.formEvents.byPath[path]) {
    data.formEvents.byPath[path] = { views: 0, starts: 0, completions: 0 };
  }
  data.formEvents.byPath[path][eventType] += 1;

  // Update timestamps
  if (!data.timestamps.firstEvent) {
    data.timestamps.firstEvent = now;
  }
  data.timestamps.lastEvent = now;

  saveAnalyticsData(data);
}

/**
 * Track a PDF download
 * @param {string} type - The type of PDF (e.g., 'checklist', 'guide')
 */
export function trackPDFDownload(type) {
  const data = getAnalyticsData();
  const now = new Date().toISOString();

  // Update total downloads
  data.pdfDownloads.total += 1;

  // Update by type
  if (!data.pdfDownloads.byType[type]) {
    data.pdfDownloads.byType[type] = 0;
  }
  data.pdfDownloads.byType[type] += 1;

  // Update timestamps
  if (!data.timestamps.firstEvent) {
    data.timestamps.firstEvent = now;
  }
  data.timestamps.lastEvent = now;

  saveAnalyticsData(data);
}

/**
 * Track a quiz event
 * @param {string} eventType - 'start' or 'complete'
 * @param {number} score - The quiz score (for complete events)
 */
export function trackQuizEvent(eventType, score = null) {
  const data = getAnalyticsData();
  const now = new Date().toISOString();

  if (eventType === 'start') {
    data.quizEvents.starts += 1;
  } else if (eventType === 'complete' && score !== null) {
    data.quizEvents.completions += 1;
    data.quizEvents.totalScore += score;
    // Recalculate average
    data.quizEvents.averageScore = data.quizEvents.totalScore / data.quizEvents.completions;
  }

  // Update timestamps
  if (!data.timestamps.firstEvent) {
    data.timestamps.firstEvent = now;
  }
  data.timestamps.lastEvent = now;

  saveAnalyticsData(data);
}

/**
 * Track an email capture
 * @param {string} source - The source of the email capture (e.g., 'form', 'popup')
 */
export function trackEmailCapture(source) {
  const data = getAnalyticsData();
  const now = new Date().toISOString();

  // Update total captures
  data.emailCaptures.total += 1;

  // Update by source
  if (!data.emailCaptures.bySource[source]) {
    data.emailCaptures.bySource[source] = 0;
  }
  data.emailCaptures.bySource[source] += 1;

  // Update timestamps
  if (!data.timestamps.firstEvent) {
    data.timestamps.firstEvent = now;
  }
  data.timestamps.lastEvent = now;

  saveAnalyticsData(data);
}

/**
 * Track an A/B test event
 * @param {string} testName - The name of the A/B test
 * @param {string} variant - The variant name
 * @param {string} eventType - 'view' or 'conversion'
 */
export function trackABTestEvent(testName, variant, eventType) {
  const data = getAnalyticsData();
  const now = new Date().toISOString();

  if (!data.abTests[testName]) {
    data.abTests[testName] = {};
  }
  if (!data.abTests[testName][variant]) {
    data.abTests[testName][variant] = { views: 0, conversions: 0 };
  }

  if (eventType === 'view') {
    data.abTests[testName][variant].views += 1;
  } else if (eventType === 'conversion') {
    data.abTests[testName][variant].conversions += 1;
  }

  // Update timestamps
  if (!data.timestamps.firstEvent) {
    data.timestamps.firstEvent = now;
  }
  data.timestamps.lastEvent = now;

  saveAnalyticsData(data);
}

/**
 * Get analytics summary for the dashboard
 * @param {number} days - Number of days to include (default: 7)
 * @returns {Object} Summary data
 */
export function getAnalyticsSummary(days = 7) {
  const data = getAnalyticsData();
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Filter daily data for the specified period
  const dailyData = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    dailyData.push({
      day: dayName,
      date: dateStr,
      pageViews: data.pageViews.daily[dateStr] || 0,
      uniqueVisitors: 0, // We'd need to track this separately for accuracy
    });
  }

  return {
    totalPageViews: data.pageViews.total,
    totalUniqueVisitors: data.uniqueVisitors.total,
    totalPDFDownloads: data.pdfDownloads.total,
    totalEmailCaptures: data.emailCaptures.total,
    conversionRate: data.formEvents.views > 0
      ? ((data.formEvents.completions / data.formEvents.views) * 100).toFixed(1)
      : 0,
    dailyData,
    funnelData: [
      { stage: 'Form Views', value: data.formEvents.views },
      { stage: 'Form Starts', value: data.formEvents.starts },
      { stage: 'Email Captures', value: data.emailCaptures.total },
      { stage: 'PDF Downloads', value: data.pdfDownloads.total },
    ],
    quizData: {
      starts: data.quizEvents.starts,
      completions: data.quizEvents.completions,
      completionRate: data.quizEvents.starts > 0
        ? ((data.quizEvents.completions / data.quizEvents.starts) * 100).toFixed(0)
        : 0,
      averageScore: data.quizEvents.averageScore.toFixed(1),
    },
    abTestData: Object.entries(data.abTests).map(([testName, variants]) => ({
      testName,
      variants: Object.entries(variants).map(([variant, stats]) => ({
        variant,
        ...stats,
      })),
    })),
  };
}

/**
 * Reset analytics data (for testing purposes)
 */
export function resetAnalytics() {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
}

/**
 * Deep merge two objects
 * @param {Object} target - The target object
 * @param {Object} source - The source object
 * @returns {Object} Merged object
 */
function mergeDeep(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

/**
 * Check if value is an object
 * @param {*} item - The item to check
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate or get a unique user ID
 * @returns {string} User ID
 */
export function getUserId() {
  if (typeof window === 'undefined') {
    return null;
  }

  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
}
