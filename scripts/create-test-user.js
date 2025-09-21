const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('👤 Creating test user...')
    
    const testEmail = 'test@example.com'
    const testPassword = 'test123456'
    const testName = 'Test User'
    
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (existingUser) {
      console.log('⚠️  Test user already exists')
      
      // Update password for existing test user
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      await prisma.user.update({
        where: { email: testEmail },
        data: { password: hashedPassword }
      })
      console.log('✅ Updated test user password')
    } else {
      // Create new test user
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      const user = await prisma.user.create({
        data: {
          name: testName,
          email: testEmail,
          password: hashedPassword,
          role: 'USER'
        }
      })
      console.log('✅ Test user created successfully')
    }
    
    console.log(`📧 Email: ${testEmail}`)
    console.log(`🔑 Password: ${testPassword}`)
    console.log('🧪 You can now test login with these credentials')
    
  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()