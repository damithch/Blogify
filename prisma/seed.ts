import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function createInitialAdmin() {
  try {
    console.log('🌱 Seeding database with initial admin user...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      return
    }
    
    // Create initial admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blogify.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'System Administrator'
    
    const hashedPassword = await hashPassword(adminPassword)
    
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Initial admin user created successfully!')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`🔑 Password: ${adminPassword}`)
    console.log('⚠️  Please change the password after first login!')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }
}

async function main() {
  try {
    await createInitialAdmin()
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { createInitialAdmin }