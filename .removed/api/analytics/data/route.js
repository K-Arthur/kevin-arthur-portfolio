import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';



// File path for persistent analytics storage
const ANALYTICS_FILE_PATH = join(process.cwd(), 'data', 'analytics.json');

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
 * Read analytics data from file
 */
async function readAnalyticsData() {
  try {
    const data = await readFile(ANALYTICS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return default
    return DEFAULT_ANALYTICS;
  }
}

/**
 * GET /api/analytics/data
 * Retrieve analytics data for the dashboard
 */
export async function generateStaticParams() {
  return [];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    // Read analytics data
    const analytics = await readAnalyticsData();

    // Calculate daily data for the specified period
    const dailyData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      dailyData.push({
        day: dayName,
        date: dateStr,
        pageViews: analytics.pageViews.daily[dateStr] || 0,
        uniqueVisitors: 0, // We'd need to track this separately for accuracy
      });
    }

    // Calculate conversion rate
    const conversionRate = analytics.formEvents.views > 0
      ? ((analytics.formEvents.completions / analytics.formEvents.views) * 100).toFixed(1)
      : '0.0';

    // Calculate quiz completion rate
    const quizCompletionRate = analytics.quizEvents.starts > 0
      ? ((analytics.quizEvents.completions / analytics.quizEvents.starts) * 100).toFixed(0)
      : '0';

    // Calculate quiz average score
    const quizAverageScore = analytics.quizEvents.averageScore.toFixed(1);

    // Prepare funnel data
    const funnelData = [
      { stage: 'Form Views', value: analytics.formEvents.views },
      { stage: 'Form Starts', value: analytics.formEvents.starts },
      { stage: 'Email Captures', value: analytics.emailCaptures.total },
      { stage: 'PDF Downloads', value: analytics.pdfDownloads.total },
    ];

    // Prepare lead score distribution (mock data for now, would need real lead scoring)
    const leadScoreDistribution = [
      { name: 'Hot Leads', value: 0, color: '#ef4444' },
      { name: 'Warm Leads', value: 0, color: '#f59e0b' },
      { name: 'Cold Leads', value: 0, color: '#3b82f6' },
    ];

    // Prepare A/B test data
    const abTestData = Object.entries(analytics.abTests).map(([testName, variants]) => {
      const variantEntries = Object.entries(variants);
      if (variantEntries.length === 0) {
        return { variant: testName, views: 0, conversions: 0 };
      }
      // Sum up all variants for the test
      const totalViews = variantEntries.reduce((sum, [, stats]) => sum + (stats.views || 0), 0);
      const totalConversions = variantEntries.reduce((sum, [, stats]) => sum + (stats.conversions || 0), 0);
      return { variant: testName, views: totalViews, conversions: totalConversions };
    });

    // If no A/B test data, provide mock data for demonstration
    if (abTestData.length === 0) {
      abTestData.push(
        { variant: 'Stop Losing Weeks', views: 0, conversions: 0 },
        { variant: 'Cut Handoff Time', views: 0, conversions: 0 },
        { variant: 'Reduce Friction', views: 0, conversions: 0 }
      );
    }

    // Prepare response
    const response = {
      summary: {
        totalPageViews: analytics.pageViews.total,
        totalUniqueVisitors: analytics.uniqueVisitors.total,
        totalPDFDownloads: analytics.pdfDownloads.total,
        totalEmailCaptures: analytics.emailCaptures.total,
        conversionRate: parseFloat(conversionRate),
      },
      dailyData,
      funnelData,
      leadScoreDistribution,
      abTestData,
      quizData: {
        starts: analytics.quizEvents.starts,
        completions: analytics.quizEvents.completions,
        completionRate: parseInt(quizCompletionRate, 10),
        averageScore: parseFloat(quizAverageScore),
      },
      timestamps: analytics.timestamps,
      byPath: {
        pageViews: analytics.pageViews.byPath,
        formEvents: analytics.formEvents.byPath,
      },
      byType: {
        pdfDownloads: analytics.pdfDownloads.byType,
        emailCaptures: analytics.emailCaptures.bySource,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error retrieving analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data', details: error.message },
      { status: 500 }
    );
  }
}
