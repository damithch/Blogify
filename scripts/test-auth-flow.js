const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAuthentication() {
  console.log('🧪 Testing Authentication Process...\n')
  
  const testAccounts = [
    {
      email: 'test@example.com',
      password: 'test123456',
      expectedRole: 'USER',
      description: 'Test User Account'
    },
    {
      email: 'admin@test.com', 
      password: 'admin123456',
      expectedRole: 'ADMIN',
      description: 'Test Admin Account'
    }
  ]

  for (const account of testAccounts) {
    console.log(`🔐 Testing ${account.description}:`)
    console.log(`   📧 Email: ${account.email}`)
    console.log(`   🔑 Password: ${account.password}`)
    console.log(`   🎯 Expected Role: ${account.expectedRole}`)
    
    try {
      // Step 1: Find user (simulating auth.config.ts logic)
      const user = await prisma.user.findUnique({
        where: {
          email: account.email.toLowerCase() // Email normalization
        }
      })
      
      if (!user) {
        console.log('   ❌ User not found in database')
        console.log('')
        continue
      }
      
      console.log(`   👤 Found user: ${user.name}`)
      console.log(`   🏷️  Database Role: ${user.role}`)
      
      // Step 2: Verify password (simulating auth.config.ts logic)
      const isPasswordValid = await bcrypt.compare(account.password, user.password)
      
      if (!isPasswordValid) {
        console.log('   ❌ Password verification failed')
        console.log('')
        continue
      }
      
      console.log('   ✅ Password verification successful')
      
      // Step 3: Check role match
      if (user.role === account.expectedRole) {
        console.log(`   ✅ Role verification successful: ${user.role}`)
        
        // Step 4: Simulate redirect logic
        if (user.role === 'ADMIN') {
          console.log('   🚀 Would redirect to: /admin')
        } else {
          console.log('   🚀 Would redirect to: /dashboard')
        }
      } else {
        console.log(`   ⚠️  Role mismatch: Expected ${account.expectedRole}, got ${user.role}`)
      }
      
    } catch (error) {
      console.log(`   ❌ Authentication error: ${error.message}`)
    }
    
    console.log('')
  }
  
  console.log('🎯 Authentication Flow Summary:')
  console.log('1. User enters credentials on /auth/signin')
  console.log('2. NextAuth calls authorize() function in auth.config.ts')
  console.log('3. Email normalized to lowercase for database lookup')
  console.log('4. Password verified with bcrypt.compare()')
  console.log('5. User object returned with role information')
  console.log('6. JWT token created with role in callbacks')
  console.log('7. Session object populated with user role')
  console.log('8. Redirect page (/auth/redirect) checks session.user.role')
  console.log('9. ADMIN → /admin, USER → /dashboard')
  
  await prisma.$disconnect()
}

testAuthentication().catch(console.error)