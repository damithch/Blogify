import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminDashboard from "./AdminDashboard"

async function getAllPosts() {
  return await prisma.post.findMany({
    include: { 
      author: { select: { name: true, email: true } } 
    },
    orderBy: { createdAt: 'desc' }
  })
}

async function getStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PENDING' } }),
    prisma.post.count({ where: { status: 'APPROVED' } }),
    prisma.post.count({ where: { status: 'REJECTED' } })
  ])
  
  return { total, pending, approved, rejected }
}

export default async function AdminPanel() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const [posts, stats] = await Promise.all([
    getAllPosts(),
    getStats()
  ])

  return <AdminDashboard session={session} posts={posts} stats={stats} />
}