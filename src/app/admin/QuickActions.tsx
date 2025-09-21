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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Review Pending Posts */}
        {stats.pending > 0 && (
          <button
            onClick={() => onFilterChange('pending')}
            className="group flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-yellow-200 hover:border-yellow-300 hover:scale-105"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors">Review Pending</p>
              <p className="text-sm text-gray-600 group-hover:text-yellow-600 transition-colors">{stats.pending} posts waiting</p>
            </div>
          </button>
        )}

        {/* View All Posts */}
        <button
          onClick={() => onFilterChange('all')}
          className="group flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:scale-105"
        >
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">All Posts</p>
            <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{stats.total} total posts</p>
          </div>
        </button>

        {/* View Approved */}
        {stats.approved > 0 && (
          <button
            onClick={() => onFilterChange('approved')}
            className="group flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-green-200 hover:border-green-300 hover:scale-105"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Approved</p>
              <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors">{stats.approved} published</p>
            </div>
          </button>
        )}

        {/* View Rejected */}
        {stats.rejected > 0 && (
          <button
            onClick={() => onFilterChange('rejected')}
            className="group flex items-center space-x-3 bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-red-200 hover:border-red-300 hover:scale-105"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors">Rejected</p>
              <p className="text-sm text-gray-600 group-hover:text-red-600 transition-colors">{stats.rejected} declined</p>
            </div>
          </button>
        )}
      </div>

      {/* Additional Quick Links */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-6">
          <p className="text-sm font-semibold text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Quick Links:
          </p>
          <a 
            href="/" 
            target="_blank" 
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            <span>View Site</span>
          </a>
          <a 
            href="/dashboard/new-post" 
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Create Post</span>
          </a>
          <a 
            href="/dashboard" 
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
            </svg>
            <span>User Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  )
}