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
      className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 ${className}`}
      type="button"
    >
      Sign Out
    </button>
  )
}