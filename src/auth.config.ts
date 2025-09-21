import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "./lib/prisma"

export default {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        const email = (credentials.email as string).toLowerCase()
        const password = credentials.password as string

        // Check hardcoded admin credentials first (for assignment demo)
        const DEMO_ADMIN_EMAIL = 'admin@blogify.com'
        const DEMO_ADMIN_PASSWORD = 'admin123'
        
        if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
          console.log('Demo admin authenticated successfully')
          return {
            id: 'demo-admin-001',
            email: DEMO_ADMIN_EMAIL,
            name: 'Demo Administrator',
            role: 'ADMIN',
          }
        }

        try {
          // Check database users for regular authentication
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user) {
            console.log('User not found for email:', credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            console.log('Invalid password for user:', user.email)
            return null
          }

          console.log('Database user authenticated successfully:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signOut() {
      console.log('User signed out successfully')
    },
  },
} satisfies NextAuthConfig