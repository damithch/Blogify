'use client'

interface BulkActionsProps {
  selectedPostIds: string[]
  onBulkAction: (action: 'approve' | 'reject' | 'delete', postIds: string[]) => Promise<void>
  isLoading: boolean
  onClearSelection: () => void
}

export default function BulkActions({ 
  selectedPostIds, 
  onBulkAction, 
  isLoading, 
  onClearSelection 
}: BulkActionsProps) {
  const selectedCount = selectedPostIds.length

  if (selectedCount === 0) return null

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    const actionText = action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'delete'
    const confirmMessage = `Are you sure you want to ${actionText} ${selectedCount} selected post(s)?`
    
    if (!confirm(confirmMessage)) {
      return
    }
    
    await onBulkAction(action, selectedPostIds)
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-indigo-900">
            {selectedCount} post{selectedCount > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Clear selection
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleBulkAction('approve')}
            disabled={isLoading}
            className="px-3 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : '✓ Bulk Approve'}
          </button>
          <button
            onClick={() => handleBulkAction('reject')}
            disabled={isLoading}
            className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : '✗ Bulk Reject'}
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            disabled={isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : '🗑️ Bulk Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}