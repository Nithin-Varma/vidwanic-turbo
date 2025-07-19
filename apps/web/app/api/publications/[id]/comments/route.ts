import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        magazineId: params.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // For demo purposes, we'll use the existing sample user or create one
    let user = await prisma.user.findFirst({
      where: {
        email: 'student@example.com'
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'student@example.com'
        }
      });
    }
    
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        userId: user.id,
        magazineId: params.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}