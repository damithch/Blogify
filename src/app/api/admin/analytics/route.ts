import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Basic post counts
    const [totalPosts, pendingPosts, approvedPosts, rejectedPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PENDING' } }),
      prisma.post.count({ where: { status: 'APPROVED' } }),
      prisma.post.count({ where: { status: 'REJECTED' } })
    ])

    // Posts created in the last X days
    const recentPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Posts by status in the last X days
    const recentPostsByStatus = await Promise.all([
      prisma.post.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'PENDING'
        }
      }),
      prisma.post.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'APPROVED'
        }
      }),
      prisma.post.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'REJECTED'
        }
      })
    ])

    // Daily post creation trend (last 7 days)
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

      const dayPosts = await prisma.post.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd
          }
        }
      })

      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        posts: dayPosts
      })
    }

    // Top authors by post count
    const topAuthors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      where: {
        posts: {
          some: {}
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Average post length
    const posts = await prisma.post.findMany({
      select: {
        content: true
      }
    })

    const avgContentLength = posts.length > 0 
      ? Math.round(posts.reduce((sum, post) => sum + post.content.length, 0) / posts.length)
      : 0

    // Posts by month (last 6 months)
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1)

      const monthPosts = await prisma.post.count({
        where: {
          createdAt: {
            gte: monthStart,
            lt: monthEnd
          }
        }
      })

      monthlyStats.push({
        month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        posts: monthPosts
      })
    }

    // Recent activity (posts in the last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const recentActivity = await prisma.post.count({
      where: {
        createdAt: {
          gte: yesterday
        }
      }
    })

    // User count
    const totalUsers = await prisma.user.count()
    const adminUsers = await prisma.user.count({
      where: { role: 'ADMIN' }
    })

    return NextResponse.json({
      overview: {
        totalPosts,
        pendingPosts,
        approvedPosts,
        rejectedPosts,
        totalUsers,
        adminUsers
      },
      recent: {
        posts: recentPosts,
        pending: recentPostsByStatus[0],
        approved: recentPostsByStatus[1],
        rejected: recentPostsByStatus[2],
        activity24h: recentActivity
      },
      trends: {
        daily: dailyStats,
        monthly: monthlyStats
      },
      insights: {
        topAuthors: topAuthors.map(author => ({
          id: author.id,
          name: author.name,
          email: author.email,
          postCount: author._count.posts
        })),
        avgContentLength
      },
      period: `${days} days`
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}