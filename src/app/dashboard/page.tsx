'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import { useSession } from "next-auth/react"

interface Post {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [session, status, router])

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(postId)

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the deleted post from the local state
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        const data = await response.json()
        alert(`Failed to delete post: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
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
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {session.user.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <Link
            href="/dashboard/new-post"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
            <p className="text-3xl font-bold text-indigo-600">{posts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Approved</h3>
            <p className="text-3xl font-bold text-green-600">
              {posts.filter(p => p.status === 'APPROVED').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {posts.filter(p => p.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">
              {posts.filter(p => p.status === 'REJECTED').length}
            </p>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
          </div>
          
          {posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">You haven&apos;t created any posts yet.</p>
              <Link
                href="/dashboard/new-post"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}
                        >
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {post.status === 'APPROVED' && (
                        <Link
                          href={`/posts/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/edit/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={isDeleting === post.id}
                        className="text-red-600 hover:text-red-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting === post.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}