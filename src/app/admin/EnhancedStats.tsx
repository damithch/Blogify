'use client'

import { useEffect, useState } from 'react'

interface Analytics {
  overview: {
    totalPosts: number
    pendingPosts: number
    approvedPosts: number
    rejectedPosts: number
    totalUsers: number
    adminUsers: number
  }
  recent: {
    posts: number
    pending: number
    approved: number
    rejected: number
    activity24h: number
  }
  trends: {
    daily: Array<{ date: string; posts: number }>
    monthly: Array<{ month: string; posts: number }>
  }
  insights: {
    topAuthors: Array<{
      id: string
      name: string
      email: string
      postCount: number
    }>
    avgContentLength: number
  }
  period: string
}

interface EnhancedStatsProps {
  initialStats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
}

export default function EnhancedStats({ initialStats }: EnhancedStatsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(30)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (days: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/analytics?days=${days}`)
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Analytics fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(selectedPeriod)
  }, [selectedPeriod])

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days)
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Error loading analytics: {error}</p>
        <button 
          onClick={() => fetchAnalytics(selectedPeriod)}
          className="text-red-700 underline text-sm mt-2"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => handlePeriodChange(days)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === days
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
          <p className="text-3xl font-bold text-blue-600">{initialStats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600">{initialStats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{initialStats.approved}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{initialStats.rejected}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading analytics...</p>
        </div>
      ) : analytics && (
        <>
          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Recent Posts</h4>
              <p className="text-2xl font-bold text-indigo-600">{analytics.recent.posts}</p>
              <p className="text-xs text-gray-400">Last {selectedPeriod} days</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">24h Activity</h4>
              <p className="text-2xl font-bold text-green-600">{analytics.recent.activity24h}</p>
              <p className="text-xs text-gray-400">New posts today</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Total Users</h4>
              <p className="text-2xl font-bold text-purple-600">{analytics.overview.totalUsers}</p>
              <p className="text-xs text-gray-400">{analytics.overview.adminUsers} admins</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Avg Length</h4>
              <p className="text-2xl font-bold text-orange-600">{analytics.insights.avgContentLength}</p>
              <p className="text-xs text-gray-400">Characters per post</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Approval Rate</h4>
              <p className="text-2xl font-bold text-teal-600">
                {analytics.overview.totalPosts > 0 
                  ? Math.round((analytics.overview.approvedPosts / analytics.overview.totalPosts) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-400">Posts approved</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Rejection Rate</h4>
              <p className="text-2xl font-bold text-red-500">
                {analytics.overview.totalPosts > 0 
                  ? Math.round((analytics.overview.rejectedPosts / analytics.overview.totalPosts) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-400">Posts rejected</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Trend */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (Last 7 Days)</h3>
              <div className="space-y-2">
                {analytics.trends.daily.map((day, index) => {
                  const maxPosts = Math.max(...analytics.trends.daily.map(d => d.posts), 1)
                  const width = (day.posts / maxPosts) * 100
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-gray-500">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">
                        {day.posts}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend (Last 6 Months)</h3>
              <div className="space-y-2">
                {analytics.trends.monthly.map((month, index) => {
                  const maxPosts = Math.max(...analytics.trends.monthly.map(m => m.posts), 1)
                  const width = (month.posts / maxPosts) * 100
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-gray-500">
                        {month.month}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-green-600 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">
                        {month.posts}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Top Authors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
            {analytics.insights.topAuthors.length > 0 ? (
              <div className="space-y-3">
                {analytics.insights.topAuthors.map((author, index) => (
                  <div key={author.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {author.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          ({author.email})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {author.postCount} posts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No authors found</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}