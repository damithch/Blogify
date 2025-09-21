'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      // Still checking session, wait
      return
    }

    if (!session) {
      // No session, redirect to signin
      router.push('/auth/signin')
      return
    }

    // Check user role and redirect accordingly
    if (session.user?.role === 'ADMIN') {
      console.log('Admin user detected, redirecting to admin dashboard')
      router.push('/admin')
    } else {
      console.log('Regular user detected, redirecting to user dashboard')
      router.push('/dashboard')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {status === 'loading' ? 'Checking authentication...' : 'Redirecting...'}
        </p>
        {session?.user?.role === 'ADMIN' && (
          <p className="mt-2 text-sm text-indigo-600">👑 Welcome Admin!</p>
        )}
      </div>
    </div>
  )
}