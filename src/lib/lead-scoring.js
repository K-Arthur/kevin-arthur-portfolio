'use client';

/**
 * Lead Scoring Library
 * 
 * Lead scoring logic based on user actions
 * Defines scoring rules and calculates lead scores
 */

const LEAD_SCORE_STORAGE_KEY = 'lead-score-data';
const LEAD_SCORE_USER_ID_KEY = 'lead-score-user-id';

/**
 * Scoring rules for different user actions
 */
export const SCORING_RULES = {
  // Resource downloads
  DOWNLOAD_CHECKLIST: {
    points: 10,
    category: 'engagement',
    description: 'Downloaded design checklist',
  },
  COMPLETE_QUIZ: {
    points: 15,
    category: 'engagement',
    description: 'Completed AI readiness quiz',
  },
  REQUEST_AI_REPORT: {
    points: 20,
    category: 'high-intent',
    description: 'Requested AI audit report',
  },
  JOIN_WAITLIST: {
    points: 5,
    category: 'interest',
    description: 'Joined waitlist',
  },
  
  // Page engagement
  VIEW_MULTIPLE_PAGES: {
    points: 5,
    category: 'engagement',
    description: 'Viewed multiple pages',
  },
  TIME_ON_SITE_2MIN: {
    points: 3,
    category: 'engagement',
    description: 'Spent 2+ minutes on site',
  },
  TIME_ON_SITE_5MIN: {
    points: 5,
    category: 'engagement',
    description: 'Spent 5+ minutes on site',
  },
  
  // Form interactions
  START_CHECKLIST_FORM: {
    points: 2,
    category: 'interest',
    description: 'Started checklist form',
  },
  START_QUIZ: {
    points: 3,
    category: 'engagement',
    description: 'Started AI readiness quiz',
  },
  
  // Social proof
  VIEW_SOCIAL_PROOF: {
    points: 1,
    category: 'engagement',
    description: 'Viewed social proof section',
  },
  CLICK_CTA: {
    points: 2,
    category: 'interest',
    description: 'Clicked CTA button',
  },
};

/**
 * Lead score tiers for prioritization
 */
export const LEAD_TIERS = {
  HOT: {
    minScore: 30,
    label: 'Hot Lead',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    priority: 1,
  },
  WARM: {
    minScore: 15,
    label: 'Warm Lead',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    priority: 2,
  },
  COLD: {
    minScore: 0,
    label: 'Cold Lead',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    priority: 3,
  },
};

/**
 * Get or create a unique user ID for lead scoring
 * @returns {string} Unique user ID
 */
export function getLeadScoreUserId() {
  if (typeof window === 'undefined') return null;
  
  try {
    let userId = localStorage.getItem(LEAD_SCORE_USER_ID_KEY);
    if (!userId) {
      userId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(LEAD_SCORE_USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    console.error('Error getting lead score user ID:', error);
    return null;
  }
}

/**
 * Get lead score data from localStorage
 * @returns {Object} Lead score data
 */
export function getLeadScoreData() {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(LEAD_SCORE_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure all required fields exist
      return {
        userId: data.userId || getLeadScoreUserId(),
        score: data.score || 0,
        actions: data.actions || [],
        tier: data.tier || 'COLD',
        firstSeenAt: data.firstSeenAt || Date.now(),
        lastUpdatedAt: data.lastUpdatedAt || Date.now(),
        timeOnSite: data.timeOnSite || 0,
        pagesViewed: data.pagesViewed || [],
      };
    }
  } catch (error) {
    console.error('Error getting lead score data:', error);
  }
  
  // Return default data if none exists
  return {
    userId: getLeadScoreUserId(),
    score: 0,
    actions: [],
    tier: 'COLD',
    firstSeenAt: Date.now(),
    lastUpdatedAt: Date.now(),
    timeOnSite: 0,
    pagesViewed: [],
  };
}

/**
 * Save lead score data to localStorage
 * @param {Object} data - Lead score data to save
 */
export function saveLeadScoreData(data) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LEAD_SCORE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving lead score data:', error);
  }
}

/**
 * Calculate lead tier based on score
 * @param {number} score - Lead score
 * @returns {string} Tier name (HOT, WARM, COLD)
 */
export function calculateLeadTier(score) {
  if (score >= LEAD_TIERS.HOT.minScore) return 'HOT';
  if (score >= LEAD_TIERS.WARM.minScore) return 'WARM';
  return 'COLD';
}

/**
 * Add points to lead score for a specific action
 * @param {string} actionKey - Key from SCORING_RULES
 * @param {Object} metadata - Additional metadata about the action
 * @returns {Object} Updated lead score data
 */
export function addLeadScorePoints(actionKey, metadata = {}) {
  if (typeof window === 'undefined') return null;
  
  try {
    const rule = SCORING_RULES[actionKey];
    if (!rule) {
      console.warn(`Unknown action key: ${actionKey}`);
      return null;
    }
    
    const data = getLeadScoreData();
    
    // Check if this action has already been scored (prevent duplicate scoring)
    const existingAction = data.actions.find(
      (a) => a.actionKey === actionKey && a.metadata?.uniqueId === metadata.uniqueId
    );
    
    if (existingAction) {
      return data; // Already scored this action
    }
    
    // Add points
    data.score += rule.points;
    data.lastUpdatedAt = Date.now();
    
    // Record action
    data.actions.push({
      actionKey,
      points: rule.points,
      category: rule.category,
      description: rule.description,
      timestamp: Date.now(),
      metadata,
    });
    
    // Recalculate tier
    data.tier = calculateLeadTier(data.score);
    
    // Save updated data
    saveLeadScoreData(data);
    
    // Track with analytics
    trackLeadScoreEvent(actionKey, rule.points, data.score, data.tier);
    
    return data;
  } catch (error) {
    console.error('Error adding lead score points:', error);
    return null;
  }
}

/**
 * Track lead score events with analytics
 * @param {string} actionKey - Action key
 * @param {number} points - Points added
 * @param {number} totalScore - Total score after adding points
 * @param {string} tier - Lead tier
 */
async function trackLeadScoreEvent(actionKey, points, totalScore, tier) {
  if (typeof window === 'undefined') return;
  
  try {
    // Track with Plausible if available
    if (window.plausible) {
      window.plausible('Lead Score Update', {
        props: {
          action: actionKey,
          points_added: points,
          total_score: totalScore,
          tier,
        },
      });
    }
    
    // Track with GA4 if available
    if (window.gtag) {
      window.gtag('event', 'lead_score_update', {
        action: actionKey,
        points_added: points,
        total_score: totalScore,
        tier,
      });
    }
    
    // Send to our tracking API
    await fetch('/api/lead-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionKey,
        points,
        totalScore,
        tier,
        timestamp: Date.now(),
      }),
    }).catch((error) => {
      console.error('Error tracking lead score event:', error);
    });
  } catch (error) {
    console.error('Error tracking lead score event:', error);
  }
}

/**
 * Get lead tier information
 * @param {string} tierName - Tier name (HOT, WARM, COLD)
 * @returns {Object} Tier information
 */
export function getLeadTierInfo(tierName) {
  return LEAD_TIERS[tierName] || LEAD_TIERS.COLD;
}

/**
 * Reset lead score data (for testing purposes)
 */
export function resetLeadScore() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LEAD_SCORE_STORAGE_KEY);
    localStorage.removeItem(LEAD_SCORE_USER_ID_KEY);
  } catch (error) {
    console.error('Error resetting lead score:', error);
  }
}

/**
 * Track page view for lead scoring
 * @param {string} pagePath - Current page path
 */
export function trackPageView(pagePath) {
  if (typeof window === 'undefined') return;
  
  try {
    const data = getLeadScoreData();
    
    // Add page to viewed pages if not already viewed
    if (!data.pagesViewed.includes(pagePath)) {
      data.pagesViewed.push(pagePath);
      
      // Award points for viewing multiple pages
      if (data.pagesViewed.length >= 3) {
        addLeadScorePoints('VIEW_MULTIPLE_PAGES', {
          pages: data.pagesViewed.length,
        });
      }
      
      saveLeadScoreData(data);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track time on site
 * @param {number} seconds - Time spent on site in seconds
 */
export function trackTimeOnSite(seconds) {
  if (typeof window === 'undefined') return;
  
  try {
    const data = getLeadScoreData();
    data.timeOnSite = seconds;
    
    // Award points for time spent on site
    if (seconds >= 120 && !data.actions.some((a) => a.actionKey === 'TIME_ON_SITE_2MIN')) {
      addLeadScorePoints('TIME_ON_SITE_2MIN', { seconds });
    } else if (seconds >= 300 && !data.actions.some((a) => a.actionKey === 'TIME_ON_SITE_5MIN')) {
      addLeadScorePoints('TIME_ON_SITE_5MIN', { seconds });
    }
    
    saveLeadScoreData(data);
  } catch (error) {
    console.error('Error tracking time on site:', error);
  }
}

/**
 * Get lead score summary for display
 * @returns {Object} Summary of lead score
 */
export function getLeadScoreSummary() {
  const data = getLeadScoreData();
  const tierInfo = getLeadTierInfo(data.tier);
  
  return {
    score: data.score,
    tier: data.tier,
    tierLabel: tierInfo.label,
    tierColor: tierInfo.color,
    tierBgColor: tierInfo.bgColor,
    tierBorderColor: tierInfo.borderColor,
    actionsCount: data.actions.length,
    timeOnSite: data.timeOnSite,
    pagesViewed: data.pagesViewed.length,
    firstSeenAt: data.firstSeenAt,
    lastUpdatedAt: data.lastUpdatedAt,
  };
}
