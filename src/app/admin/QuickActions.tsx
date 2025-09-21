'use client'

interface QuickActionsProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void
}

export default function QuickActions({ stats, onFilterChange }: QuickActionsProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Review Pending Posts */}
        {stats.pending > 0 && (
          <button
            onClick={() => onFilterChange('pending')}
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-transparent hover:border-yellow-200"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Review Pending</p>
              <p className="text-sm text-gray-500">{stats.pending} posts waiting</p>
            </div>
          </button>
        )}

        {/* View All Posts */}
        <button
          onClick={() => onFilterChange('all')}
          className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-transparent hover:border-blue-200"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">All Posts</p>
            <p className="text-sm text-gray-500">{stats.total} total posts</p>
          </div>
        </button>

        {/* View Approved */}
        {stats.approved > 0 && (
          <button
            onClick={() => onFilterChange('approved')}
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-transparent hover:border-green-200"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Approved</p>
              <p className="text-sm text-gray-500">{stats.approved} published</p>
            </div>
          </button>
        )}

        {/* View Rejected */}
        {stats.rejected > 0 && (
          <button
            onClick={() => onFilterChange('rejected')}
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-transparent hover:border-red-200"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">❌</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Rejected</p>
              <p className="text-sm text-gray-500">{stats.rejected} declined</p>
            </div>
          </button>
        )}
      </div>

      {/* Additional Quick Links */}
      <div className="mt-6 pt-4 border-t border-indigo-100">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm font-medium text-gray-700">Quick Links:</p>
          <a 
            href="/" 
            target="_blank" 
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            🌐 View Site
          </a>
          <a 
            href="/dashboard/new-post" 
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            ✍️ Create Post
          </a>
          <a 
            href="/dashboard" 
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            📊 User Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}