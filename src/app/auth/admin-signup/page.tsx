'use client'

import Link from 'next/link'

export default function AdminSignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(15 23 42 / 0.04)%27%3e%3cpath d=%27m0 0.5 32 0M0.5 0v32%27/%3e%3c/svg%3e')] opacity-40"></div>
      
      <div className="relative z-10 max-w-md w-full">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Blogify
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Admin Access Restricted
          </h2>
          <p className="mt-2 text-gray-600">
            This system uses hardcoded admin credentials for security
          </p>
        </div>

        {/* Security Notice Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Security Warning */}
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <strong>Security Notice:</strong> This system uses hardcoded admin credentials set via environment variables.
            </div>
          </div>

          <div className="space-y-4 text-gray-600">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Hardcoded Admin Credentials</h4>
                <p className="text-sm">Admin credentials are set via environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME).</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Database Seeding</h4>
                <p className="text-sm">The admin account is automatically created during database seeding process.</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">npm run db:seed</code>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Need Admin Access?</h4>
            <p className="text-sm text-gray-600">
              Contact your system administrator or use the CLI tools if you have server access.
            </p>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <Link 
              href="/auth/signin" 
              className="block text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Sign in to existing account
            </Link>
            <Link 
              href="/auth/signup" 
              className="block text-gray-500 hover:text-gray-600 text-sm transition-colors"
            >
              Create regular user account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}