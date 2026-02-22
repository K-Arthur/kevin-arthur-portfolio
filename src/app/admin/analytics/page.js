'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaUsers,
  FaFileDownload,
  FaBrain,
  FaEnvelope,
  FaFilter,
  FaDownload,
  FaArrowLeft
} from 'react-icons/fa';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

export default function AnalyticsDashboard() {
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from API
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90;
      const response = await fetch(`/api/analytics/data?days=${days}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDateRange]);

  // Load data on mount and when date range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ];

  // Show loading state
  if (isLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading analytics: {error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use analytics data or fallback to empty state
  const summary = analyticsData?.summary || {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    totalPDFDownloads: 0,
    totalEmailCaptures: 0,
    conversionRate: 0,
  };

  const dailyData = analyticsData?.dailyData || [];
  const funnelData = analyticsData?.funnelData || [
    { stage: 'Form Views', value: 0 },
    { stage: 'Form Starts', value: 0 },
    { stage: 'Email Captures', value: 0 },
    { stage: 'PDF Downloads', value: 0 },
  ];
  const leadScoreDistribution = analyticsData?.leadScoreDistribution || [
    { name: 'Hot Leads', value: 0, color: '#ef4444' },
    { name: 'Warm Leads', value: 0, color: '#f59e0b' },
    { name: 'Cold Leads', value: 0, color: '#3b82f6' },
  ];
  const abTestData = analyticsData?.abTestData || [];
  const quizData = analyticsData?.quizData || {
    starts: 0,
    completions: 0,
    completionRate: 0,
    averageScore: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Analytics Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-4 py-2 bg-card border-2 border-border/50 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground cursor-pointer"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchAnalyticsData}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <FaFilter className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FaChartLine className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.totalPageViews.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Page Views</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.totalUniqueVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Unique Visitors</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <FaFileDownload className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.totalPDFDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">PDF Downloads</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <FaEnvelope className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {summary.conversionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Page Views Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Page Views & Visitors Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                <YAxis stroke="currentColor" opacity={0.5} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Page Views"
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Unique Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Conversion Funnel
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis type="number" stroke="currentColor" opacity={0.5} />
                <YAxis dataKey="stage" type="category" stroke="currentColor" opacity={0.5} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lead Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Lead Score Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadScoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadScoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* A/B Test Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-enhanced p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              A/B Test Results (Headline)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={abTestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="variant" stroke="currentColor" opacity={0.5} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="currentColor" opacity={0.5} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="views" fill="#3b82f6" name="Views" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversions" fill="#10b981" name="Conversions" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quiz Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-enhanced p-6 rounded-xl mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <FaBrain className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              AI Readiness Quiz Performance
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-foreground mb-2">{quizData.completions}</div>
              <div className="text-sm text-muted-foreground">Quiz Completions</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-foreground mb-2">{quizData.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-foreground mb-2">{quizData.averageScore}</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </div>
        </motion.div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-card border-2 border-border/50 rounded-lg hover:border-primary/50 transition-colors text-foreground">
            <FaDownload className="w-4 h-4" />
            <span>Export Data (CSV)</span>
          </button>
        </div>
      </main>
    </div>
  );
}
