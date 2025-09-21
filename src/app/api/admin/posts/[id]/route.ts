import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    // Validate status value
    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be APPROVED, REJECTED, or PENDING.' },
        { status: 400 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: { select: { name: true, email: true } } }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Update post status
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date()
      },
      include: { author: { select: { name: true, email: true } } }
    })

    return NextResponse.json({
      message: `Post ${status.toLowerCase()} successfully`,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        status: updatedPost.status,
        author: updatedPost.author,
        updatedAt: updatedPost.updatedAt
      }
    })
  } catch (error) {
    console.error('Admin update post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Get post details for admin view
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { 
        author: { 
          select: { 
            id: true,
            name: true, 
            email: true,
            role: true 
          } 
        } 
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Admin get post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Admin delete post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}