import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const publication = await prisma.magazine.findUnique({
      where: {
        id: params.id
      },
      include: {
        comments: {
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
        },
        _count: {
          select: {
            purchases: true,
            comments: true
          }
        }
      }
    });

    if (!publication) {
      return NextResponse.json(
        { success: false, error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: publication
    });
  } catch (error) {
    console.error('Error fetching publication:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch publication' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const publication = await prisma.magazine.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title,
        description: body.description,
        shortDesc: body.shortDesc,
        coverImage: body.coverImage,
        price: body.price,
        suitableFor: body.suitableFor,
        totalPurchases: body.totalPurchases,
        schoolPurchases: body.schoolPurchases
      }
    });

    return NextResponse.json({
      success: true,
      data: publication
    });
  } catch (error) {
    console.error('Error updating publication:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.magazine.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Publication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting publication:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
}