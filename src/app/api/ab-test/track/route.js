import { NextResponse } from 'next/server';

/**
 * A/B Test Tracking API Endpoint
 * 
 * Tracks A/B test events for analytics
 * Stores events in localStorage on the client side
 * This endpoint can be extended to store in a database
 */

// Simple in-memory storage for demo purposes
// In production, this should be replaced with a database
const abTestEvents = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, testName, variant, eventType, metadata, timestamp } = body;

    // Validate required fields
    if (!testName || !variant || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: testName, variant, eventType' },
        { status: 400 }
      );
    }

    // Create event record
    const event = {
      id: `${testName}_${variant}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId || 'anonymous',
      testName,
      variant,
      eventType,
      metadata: metadata || {},
      timestamp: timestamp || Date.now(),
      userAgent: request.headers.get('user-agent') || '',
    };

    // Store event
    const testEvents = abTestEvents.get(testName) || [];
    testEvents.push(event);
    abTestEvents.set(testName, testEvents);

    // Return success
    return NextResponse.json({
      success: true,
      eventId: event.id,
    });
  } catch (error) {
    console.error('Error tracking A/B test event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve A/B test statistics
 * This is a simple implementation for demonstration
 * In production, this should be protected with authentication
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const testName = searchParams.get('testName');

    if (testName) {
      // Return stats for specific test
      const testEvents = abTestEvents.get(testName) || [];
      const stats = calculateTestStats(testEvents);
      
      return NextResponse.json({
        testName,
        stats,
      });
    } else {
      // Return stats for all tests
      const allStats = {};
      abTestEvents.forEach((events, testName) => {
        allStats[testName] = calculateTestStats(events);
      });
      
      return NextResponse.json({
        tests: allStats,
      });
    }
  } catch (error) {
    console.error('Error retrieving A/B test stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
}

/**
 * Calculate statistics for a test
 */
function calculateTestStats(events) {
  const stats = {
    totalEvents: events.length,
    variants: {},
    eventsByType: {},
  };

  events.forEach(event => {
    // Count by variant
    if (!stats.variants[event.variant]) {
      stats.variants[event.variant] = {
        total: 0,
        assigned: 0,
        viewed: 0,
        clicked: 0,
        converted: 0,
      };
    }
    stats.variants[event.variant].total++;
    stats.variants[event.variant][event.eventType] =
      (stats.variants[event.variant][event.eventType] || 0) + 1;

    // Count by event type
    if (!stats.eventsByType[event.eventType]) {
      stats.eventsByType[event.eventType] = 0;
    }
    stats.eventsByType[event.eventType]++;
  });

  // Calculate conversion rates for each variant
  Object.keys(stats.variants).forEach(variant => {
    const variantData = stats.variants[variant];
    if (variantData.viewed > 0) {
      variantData.conversionRate = (variantData.converted / variantData.viewed) * 100;
    } else {
      variantData.conversionRate = 0;
    }
    if (variantData.clicked > 0) {
      variantData.clickThroughRate = (variantData.converted / variantData.clicked) * 100;
    } else {
      variantData.clickThroughRate = 0;
    }
  });

  return stats;
}
