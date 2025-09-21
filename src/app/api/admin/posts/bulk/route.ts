import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { postIds, status } = await request.json()

    // Validate input
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Post IDs array is required and cannot be empty.' },
        { status: 400 }
      )
    }

    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED, REJECTED, or PENDING.' },
        { status: 400 }
      )
    }

    // Check if all posts exist
    const existingPosts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: { id: true, title: true }
    })

    if (existingPosts.length !== postIds.length) {
      return NextResponse.json(
        { error: 'One or more posts not found' },
        { status: 404 }
      )
    }

    // Update all posts
    const updateResult = await prisma.post.updateMany({
      where: { id: { in: postIds } },
      data: {
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: `Successfully ${status.toLowerCase()} ${updateResult.count} post(s)`,
      updatedCount: updateResult.count,
      postIds: postIds
    })
  } catch (error) {
    console.error('Admin bulk update posts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { postIds } = await request.json()

    // Validate input
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Post IDs array is required and cannot be empty.' },
        { status: 400 }
      )
    }

    // Check if all posts exist
    const existingPosts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: { id: true, title: true }
    })

    if (existingPosts.length !== postIds.length) {
      return NextResponse.json(
        { error: 'One or more posts not found' },
        { status: 404 }
      )
    }

    // Delete all posts
    const deleteResult = await prisma.post.deleteMany({
      where: { id: { in: postIds } }
    })

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} post(s)`,
      deletedCount: deleteResult.count,
      postIds: postIds
    })
  } catch (error) {
    console.error('Admin bulk delete posts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}