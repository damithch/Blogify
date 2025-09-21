const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Checking all users in database...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    if (users.length === 0) {
      console.log('📭 No users found in database')
      return
    }
    
    console.log(`👥 Found ${users.length} user(s):`)
    console.log('=' .repeat(80))
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🏷️  Role: ${user.role}`)
      console.log(`   📅 Created: ${user.createdAt.toISOString()}`)
      
      // Check if email needs normalization
      if (user.email !== user.email.toLowerCase()) {
        console.log(`   ⚠️  Email case issue: "${user.email}" should be "${user.email.toLowerCase()}"`)
      }
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()