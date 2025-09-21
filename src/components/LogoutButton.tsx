'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton({ className = "" }: { className?: string }) {
  const handleLogout = async () => {
    try {
      console.log('Initiating logout...')
      
      // Clear any local storage or session storage if needed
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Use NextAuth signOut with proper options
      await signOut({
        redirect: true,
        callbackUrl: '/auth/signin?message=Successfully signed out'
      })
      
      console.log('Logout completed successfully')
      
    } catch (error) {
      console.error('Logout error:', error)
      
      // Fallback: Clear storage and force redirect
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/auth/signin?message=Signed out'
      }
    }
  }

  return (
    <button 
      onClick={handleLogout}
      className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold ${className}`}
      type="button"
    >
      Sign Out
    </button>
  )
}