import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getApprovedPosts() {
  return await prisma.post.findMany({
    where: { status: 'APPROVED' },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function Home() {
  const posts = await getApprovedPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(15 23 42 / 0.04)%27%3e%3cpath d=%27m0 0.5 32 0M0.5 0v32%27/%3e%3c/svg%3e')] opacity-40"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Blogify
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-16">
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27 width=%27100%27 height=%27100%27 fill=%27none%27 stroke=%27rgb(255 255 255 / 0.1)%27%3e%3cpath d=%27M0 20h100M0 40h100M0 60h100M0 80h100%27/%3e%3c/svg%3e')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome to Blogify
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Discover amazing stories and share your own creative journey with our vibrant community
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              Start Writing
            </Link>
            <Link href="#posts" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-200">
              Explore Stories
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div id="posts" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Latest Stories</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Dive into our collection of carefully curated stories from talented writers around the world
        </p>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-6">No stories published yet.</p>
              <p className="text-gray-500 mb-8">Be the first to share your amazing story with our community!</p>
              <Link href="/auth/signup" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                Create the first story
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Featured Story</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
                    <Link href={`/posts/${post.id}`} className="text-gray-900 hover:text-indigo-600">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {post.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <Link href={`/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Read more</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
