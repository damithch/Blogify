'use client'

interface PostPreviewModalProps {
  post: {
    id: string
    title: string
    content: string
    status: string
    createdAt: Date
    updatedAt: Date
    author: {
      name: string
      email: string
    }
  } | null
  isOpen: boolean
  onClose: () => void
  onApprove?: () => void
  onReject?: () => void
  isLoading?: boolean
}

export default function PostPreviewModal({ 
  post, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  isLoading = false 
}: PostPreviewModalProps) {
  if (!isOpen || !post) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {post.title}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span 
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(post.status)}`}
                  >
                    {post.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    By {post.author.name} ({post.author.email})
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-900">
                {post.content}
              </div>
            </div>
          </div>

          {/* Actions */}
          {post.status === 'PENDING' && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Review this post to approve or reject it
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onReject}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : '✗ Reject'}
                  </button>
                  <button
                    onClick={onApprove}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : '✓ Approve'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {post.status !== 'PENDING' && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Post status: <span className="font-medium">{post.status}</span>
                </div>
                <div className="flex space-x-3">
                  {post.status === 'APPROVED' && (
                    <button
                      onClick={onReject}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : '✗ Reject'}
                    </button>
                  )}
                  {post.status === 'REJECTED' && (
                    <button
                      onClick={onApprove}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : '✓ Approve'}
                    </button>
                  )}
                  {post.status === 'APPROVED' && (
                    <button
                      onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                      className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-300 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      👁️ View Live
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}