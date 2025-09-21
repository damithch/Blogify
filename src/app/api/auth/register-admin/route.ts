import { NextResponse } from 'next/server'

// Admin registration has been disabled for security reasons
// Admin accounts can only be created through:
// 1. Database seeding (npm run db:seed)
// 2. CLI management tool (npm run admin:create)
// 3. Direct database access

export async function POST() {
  return NextResponse.json(
    { 
      error: 'Admin registration is disabled for security reasons. Use CLI tools or database seeding to create admin accounts.',
      methods: [
        'Database seeding: npm run db:seed',
        'CLI management: npm run admin:create',
        'Direct database access (emergency only)'
      ]
    },
    { status: 403 }
  )
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Admin registration endpoint is disabled',
      availableMethods: [
        'Database seeding with environment variables',
        'CLI management tool',
        'Direct database manipulation'
      ]
    },
    { status: 200 }
  )
}