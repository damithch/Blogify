const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function normalizeEmails() {
  try {
    console.log('🔧 Normalizing user emails to lowercase...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true
      }
    })
    
    if (users.length === 0) {
      console.log('📭 No users found')
      return
    }
    
    let updateCount = 0
    
    for (const user of users) {
      const normalizedEmail = user.email.toLowerCase()
      
      if (user.email !== normalizedEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: { email: normalizedEmail }
        })
        console.log(`✅ Updated: ${user.email} → ${normalizedEmail}`)
        updateCount++
      }
    }
    
    if (updateCount === 0) {
      console.log('✅ All emails are already normalized')
    } else {
      console.log(`✅ Successfully updated ${updateCount} email(s)`)
    }
    
  } catch (error) {
    console.error('❌ Error normalizing emails:', error)
  } finally {
    await prisma.$disconnect()
  }
}

normalizeEmails()