'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPostActions from './AdminPostActions'
import PostPreviewModal from './PostPreviewModal'
import BulkActions from './BulkActions'
import EnhancedStats from './EnhancedStats'
import AdminAlerts from './AdminAlerts'
import LogoutButton from '@/components/LogoutButton'

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
    const baseStyle = "whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm cursor-pointer transition-all duration-200"
    
    if (activeFilter === tab) {
      return `${baseStyle} border-indigo-500 text-indigo-600`
    }
    
    return `${baseStyle} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(15 23 42 / 0.04)%27%3e%3cpath d=%27m0 0.5 32 0M0.5 0v32%27/%3e%3c/svg%3e')] opacity-40"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Blogify
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: <span className="font-semibold text-indigo-600">{session.user.name}</span></span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Content Management System</h1>
          <p className="text-gray-600 mt-2 text-lg">Review and moderate all blog posts with powerful admin tools</p>
        </div>

        {/* Enhanced Stats */}
        <div className="mb-8">
          <EnhancedStats initialStats={stats} />
        </div>

        {/* Admin Alerts */}
        <AdminAlerts stats={stats} />

        {/* Filter Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-100">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {getTabLabel(activeFilter)}
                </h2>
                {selectedPostIds.length > 0 && (
                  <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
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
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-600 font-medium">Select all</span>
                </label>
              )}
            </div>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2">
                {activeFilter === 'all' 
                  ? 'No posts found.' 
                  : `No ${activeFilter} posts found.`
                }
              </p>
              <p className="text-gray-500">Posts will appear here when users submit them for review.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedPostIds.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span 
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(post.status)}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content.substring(0, 200)}...
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>By {post.author.name} ({post.author.email})</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span>•</span>
                        <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openPreviewModal(post)}
                        className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Preview</span>
                      </button>
                      {post.status === 'APPROVED' && (
                        <Link
                          href={`/posts/${post.id}`}
                          target="_blank"
                          className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>View Live</span>
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