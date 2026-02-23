export async function generateStaticParams() { return []; }
import { NextResponse } from 'next/server';

/**
 * Lead Score API Endpoint
 * 
 * Tracks lead score events and retrieves lead score data
 * Stores events in localStorage on the client side
 * This endpoint can be extended to store in a database
 */

// Simple in-memory storage for demo purposes
// In production, this should be replaced with a database
const leadScoreEvents = new Map();
const leadScores = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { actionKey, points, totalScore, tier, timestamp } = body;

    // Validate required fields
    if (!actionKey || points === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: actionKey, points' },
        { status: 400 }
      );
    }

    // Create event record
    const event = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      actionKey,
      points,
      totalScore,
      tier,
      timestamp: timestamp || Date.now(),
      userAgent: request.headers.get('user-agent') || '',
    };

    // Store event
    const events = leadScoreEvents.get(actionKey) || [];
    events.push(event);
    leadScoreEvents.set(actionKey, events);

    // Update lead score summary
    const summary = leadScores.get('summary') || {
      totalLeads: 0,
      totalScore: 0,
      averageScore: 0,
      tierDistribution: {
        HOT: 0,
        WARM: 0,
        COLD: 0,
      },
      topActions: {},
    };

    // Update tier distribution
    if (tier) {
      summary.tierDistribution[tier] = (summary.tierDistribution[tier] || 0) + 1;
    }

    // Update top actions
    if (!summary.topActions[actionKey]) {
      summary.topActions[actionKey] = 0;
    }
    summary.topActions[actionKey]++;

    // Update total score (this is a simplified approach)
    summary.totalScore += points;
    summary.totalLeads = Math.max(summary.totalLeads, 1);
    summary.averageScore = summary.totalScore / summary.totalLeads;

    leadScores.set('summary', summary);

    // Return success
    return NextResponse.json({
      success: true,
      eventId: event.id,
      currentScore: totalScore,
      currentTier: tier,
    });
  } catch (error) {
    console.error('Error tracking lead score event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve lead score statistics
 * This is a simple implementation for demonstration
 * In production, this should be protected with authentication
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const actionKey = searchParams.get('actionKey');

    if (actionKey) {
      // Return events for specific action
      const events = leadScoreEvents.get(actionKey) || [];
      const stats = calculateActionStats(events);
      
      return NextResponse.json({
        actionKey,
        stats,
      });
    } else {
      // Return overall summary
      const summary = leadScores.get('summary') || {
        totalLeads: 0,
        totalScore: 0,
        averageScore: 0,
        tierDistribution: {
          HOT: 0,
          WARM: 0,
          COLD: 0,
        },
        topActions: {},
      };
      
      // Calculate action stats
      const actionStats = {};
      leadScoreEvents.forEach((events, key) => {
        actionStats[key] = calculateActionStats(events);
      });
      
      return NextResponse.json({
        summary,
        actionStats,
      });
    }
  } catch (error) {
    console.error('Error retrieving lead score stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
}

/**
 * Calculate statistics for an action
 */
function calculateActionStats(events) {
  const stats = {
    totalEvents: events.length,
    totalPoints: 0,
    averagePoints: 0,
    tierDistribution: {
      HOT: 0,
      WARM: 0,
      COLD: 0,
    },
    recentEvents: [],
  };

  events.forEach(event => {
    stats.totalPoints += event.points;
    
    // Count by tier
    if (event.tier) {
      stats.tierDistribution[event.tier] = (stats.tierDistribution[event.tier] || 0) + 1;
    }
  });

  // Calculate average
  if (events.length > 0) {
    stats.averagePoints = stats.totalPoints / events.length;
  }

  // Get recent events (last 10)
  stats.recentEvents = events.slice(-10);

  return stats;
}
