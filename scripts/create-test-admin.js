const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestAdmin() {
  try {
    console.log('👑 Creating test admin account...')
    
    const testEmail = 'admin@test.com'
    const testPassword = 'admin123456'
    const testName = 'Test Admin'
    
    // Check if test admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (existingAdmin) {
      console.log('⚠️  Test admin already exists')
      
      // Update password and ensure ADMIN role
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      await prisma.user.update({
        where: { email: testEmail },
        data: { 
          password: hashedPassword,
          role: 'ADMIN' // Ensure it's admin
        }
      })
      console.log('✅ Updated test admin password and role')
    } else {
      // Create new test admin
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      const admin = await prisma.user.create({
        data: {
          name: testName,
          email: testEmail,
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log('✅ Test admin created successfully')
    }
    
    console.log(`📧 Admin Email: ${testEmail}`)
    console.log(`🔑 Admin Password: ${testPassword}`)
    console.log('👑 You can now test admin login with these credentials')
    
  } catch (error) {
    console.error('❌ Error creating test admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestAdmin()