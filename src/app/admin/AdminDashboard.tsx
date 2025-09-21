'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPostActions from './AdminPostActions'
import PostPreviewModal from './PostPreviewModal'
import BulkActions from './BulkActions'

type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Post {
  id: string
  title: string
  content: string
  status: PostStatus
  createdAt: Date
  updatedAt: Date
  author: {
    name: string
    email: string
  }
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface Session {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface AdminDashboardProps {
  session: Session
  posts: Post[]
  stats: Stats
}

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminDashboard({ session, posts, stats }: AdminDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const router = useRouter()

  const openPreviewModal = (post: Post) => {
    setSelectedPost(post)
    setIsPreviewModalOpen(true)
  }

  const closePreviewModal = () => {
    setSelectedPost(null)
    setIsPreviewModalOpen(false)
    setIsModalLoading(false)
  }

  const handleModalAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedPost) return
    
    setIsModalLoading(true)
    
    try {
      const response = await fetch(`/api/admin/posts/${selectedPost.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        closePreviewModal()
        router.refresh()
      } else {
        console.error('Failed to update post status')
      }
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setIsModalLoading(false)
    }
  }

  const togglePostSelection = (postId: string) => {
    setSelectedPostIds(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPostIds.length === filteredPosts.length) {
      setSelectedPostIds([])
    } else {
      setSelectedPostIds(filteredPosts.map(post => post.id))
    }
  }

  const clearSelection = () => {
    setSelectedPostIds([])
  }

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete', postIds: string[]) => {
    setIsBulkLoading(true)
    
    try {
      const endpoint = '/api/admin/posts/bulk'
      const method = action === 'delete' ? 'DELETE' : 'PATCH'
      const body = action === 'delete' 
        ? { postIds }
        : { postIds, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        clearSelection()
        router.refresh()
      } else {
        const data = await response.json()
        console.error('Bulk action failed:', data.error)
        alert(`Failed to ${action} posts: ${data.error}`)
      }
    } catch (error) {
      console.error('Error in bulk action:', error)
      alert('Network error occurred')
    } finally {
      setIsBulkLoading(false)
    }
  }

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

  const setActiveFilterWithClearSelection = (filter: FilterTab) => {
    setActiveFilter(filter)
    setSelectedPostIds([])
  }

  const filteredPosts = posts.filter(post => {
    switch (activeFilter) {
      case 'pending':
        return post.status === 'PENDING'
      case 'approved':
        return post.status === 'APPROVED'
      case 'rejected':
        return post.status === 'REJECTED'
      default:
        return true
    }
  })

  const getTabLabel = (tab: FilterTab) => {
    switch (tab) {
      case 'all':
        return `All Posts (${stats.total})`
      case 'pending':
        return `Pending (${stats.pending})`
      case 'approved':
        return `Approved (${stats.approved})`
      case 'rejected':
        return `Rejected (${stats.rejected})`
    }
  }

  const getTabStyle = (tab: FilterTab) => {
    const baseStyle = "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
    
    if (activeFilter === tab) {
      return `${baseStyle} border-indigo-500 text-indigo-600`
    }
    
    return `${baseStyle} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Blogify
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin: {session.user.name}</span>
              <form action="/api/auth/signout" method="post">
                <button type="submit" className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
          <p className="text-gray-600">Review and moderate all blog posts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {(['all', 'pending', 'approved', 'rejected'] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterWithClearSelection(tab)}
                  className={getTabStyle(tab)}
                >
                  {getTabLabel(tab)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bulk Actions */}
        <BulkActions
          selectedPostIds={selectedPostIds}
          onBulkAction={handleBulkAction}
          isLoading={isBulkLoading}
          onClearSelection={clearSelection}
        />

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {getTabLabel(activeFilter)}
                </h2>
                {selectedPostIds.length > 0 && (
                  <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    {selectedPostIds.length} selected
                  </span>
                )}
              </div>
              {filteredPosts.length > 0 && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPostIds.length === filteredPosts.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Select all</span>
                </label>
              )}
            </div>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {activeFilter === 'all' 
                  ? 'No posts found.' 
                  : `No ${activeFilter} posts found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedPostIds.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(post.status)}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content.substring(0, 200)}...
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author.name} ({post.author.email})</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openPreviewModal(post)}
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                      >
                        👁️ Preview
                      </button>
                      {post.status === 'APPROVED' && (
                        <Link
                          href={`/posts/${post.id}`}
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                          View Live
                        </Link>
                      )}
                      <AdminPostActions 
                        postId={post.id} 
                        currentStatus={post.status}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <PostPreviewModal
        post={selectedPost}
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        onApprove={() => handleModalAction('APPROVED')}
        onReject={() => handleModalAction('REJECTED')}
        isLoading={isModalLoading}
      />
    </div>
  )
}