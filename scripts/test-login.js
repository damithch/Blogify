const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testLogin(email, password) {
  try {
    console.log(`🔐 Testing login for: ${email}`)
    
    // Find user (same logic as auth config)
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return false
    }
    
    console.log(`👤 Found user: ${user.name} (${user.role})`)
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password')
      return false
    }
    
    console.log('✅ Login successful!')
    return true
    
  } catch (error) {
    console.error('❌ Error testing login:', error)
    return false
  }
}

// Test with existing users
async function runTests() {
  console.log('🧪 Testing user authentication...\n')
  
  // Test the users we found earlier
  await testLogin('damchandrathilake@gmail.com', 'password123') // Default password attempt
  console.log('')
  await testLogin('pavanuthsara@gmail.com', 'admin123') // Default admin password
  
  await prisma.$disconnect()
}

runTests()