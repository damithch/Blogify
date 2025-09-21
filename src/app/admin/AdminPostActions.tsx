'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminPostActionsProps {
  postId: string
  currentStatus: string
}

export default function AdminPostActions({ postId, currentStatus }: AdminPostActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const updatePostStatus = async (status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        setError(data.error || 'Failed to update post status')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const deletePost = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        setError(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}
      
      {currentStatus === 'PENDING' && (
        <>
          <button
            onClick={() => updatePostStatus('APPROVED')}
            disabled={isLoading}
            className="text-green-600 hover:text-green-500 text-sm font-medium disabled:opacity-50"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => updatePostStatus('REJECTED')}
            disabled={isLoading}
            className="text-red-600 hover:text-red-500 text-sm font-medium disabled:opacity-50"
          >
            ✗ Reject
          </button>
        </>
      )}
      
      {currentStatus === 'APPROVED' && (
        <button
          onClick={() => updatePostStatus('REJECTED')}
          disabled={isLoading}
          className="text-red-600 hover:text-red-500 text-sm font-medium disabled:opacity-50"
        >
          ✗ Reject
        </button>
      )}
      
      {currentStatus === 'REJECTED' && (
        <button
          onClick={() => updatePostStatus('APPROVED')}
          disabled={isLoading}
          className="text-green-600 hover:text-green-500 text-sm font-medium disabled:opacity-50"
        >
          ✓ Approve
        </button>
      )}

      {/* Delete button for all statuses */}
      <button
        onClick={deletePost}
        disabled={isLoading}
        className="text-gray-600 hover:text-gray-800 text-sm font-medium disabled:opacity-50 border-t pt-2"
      >
        🗑️ Delete
      </button>
      
      {isLoading && (
        <div className="text-xs text-gray-500">Processing...</div>
      )}
    </div>
  )
}