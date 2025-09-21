#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function createAdmin() {
  try {
    console.log('🔐 Admin User Creation Tool')
    console.log('==========================\n')
    
    const name = await question('Enter admin name: ')
    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password (min 6 chars): ')
    
    // Validate inputs
    if (!name || !email || !password) {
      throw new Error('All fields are required')
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      const updateChoice = await question(`User ${email} already exists. Update to admin? (y/N): `)
      if (updateChoice.toLowerCase() === 'y') {
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        })
        console.log('✅ User updated to admin role successfully!')
        return
      } else {
        console.log('❌ Operation cancelled')
        return
      }
    }
    
    // Hash password and create admin
    const hashedPassword = await hashPassword(password)
    
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('\n✅ Admin user created successfully!')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`👤 Name: ${admin.name}`)
    console.log(`🆔 ID: ${admin.id}`)
    console.log(`📅 Created: ${admin.createdAt.toISOString()}`)
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error)
  }
}

async function listAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { posts: true }
        }
      }
    })
    
    console.log('\n👥 Current Admin Users:')
    console.log('======================')
    
    if (admins.length === 0) {
      console.log('No admin users found.')
      return
    }
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.name}`)
      console.log(`   📧 ${admin.email}`)
      console.log(`   🆔 ${admin.id}`)
      console.log(`   📝 ${admin._count.posts} posts`)
      console.log(`   📅 Created: ${admin.createdAt.toDateString()}`)
    })
    
  } catch (error) {
    console.error('❌ Error listing admins:', error)
  }
}

async function promoteUser() {
  try {
    const email = await question('Enter user email to promote to admin: ')
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    if (user.role === 'ADMIN') {
      console.log('✅ User is already an admin')
      return
    }
    
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    
    console.log(`✅ ${user.name} (${email}) promoted to admin successfully!`)
    
  } catch (error) {
    console.error('❌ Error promoting user:', error)
  }
}

async function main() {
  try {
    console.log('🛠️  Blogify Admin Management Tool')
    console.log('=================================\n')
    
    const action = await question(
      'What would you like to do?\n' +
      '1. Create new admin user\n' +
      '2. List all admin users\n' +
      '3. Promote existing user to admin\n' +
      '4. Exit\n\n' +
      'Choose option (1-4): '
    )
    
    switch (action) {
      case '1':
        await createAdmin()
        break
      case '2':
        await listAdmins()
        break
      case '3':
        await promoteUser()
        break
      case '4':
        console.log('👋 Goodbye!')
        break
      default:
        console.log('❌ Invalid option')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}