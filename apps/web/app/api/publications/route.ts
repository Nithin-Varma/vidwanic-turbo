import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const publications = await prisma.magazine.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
      include: {
        _count: {
          select: {
            purchases: true,
            comments: true
          }
        }
      }
    });

    // Transform data to match our interface
    const transformedPublications = publications.map(pub => ({
      id: pub.id,
      title: pub.title,
      description: pub.description,
      shortDesc: pub.shortDesc,
      coverImage: pub.coverImage,
      price: pub.price,
      suitableFor: pub.suitableFor,
      totalPurchases: pub.totalPurchases,
      schoolPurchases: pub.schoolPurchases,
      createdAt: pub.createdAt,
      updatedAt: pub.updatedAt,
      commentsCount: pub._count.comments,
      purchasesCount: pub._count.purchases
    }));

    return NextResponse.json({
      success: true,
      data: transformedPublications
    });
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const publication = await prisma.magazine.create({
      data: {
        title: body.title,
        description: body.description,
        shortDesc: body.shortDesc,
        coverImage: body.coverImage,
        price: body.price,
        suitableFor: body.suitableFor,
        totalPurchases: body.totalPurchases || 0,
        schoolPurchases: body.schoolPurchases || 0
      }
    });

    return NextResponse.json({
      success: true,
      data: publication
    });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create publication' },
      { status: 500 }
    );
  }
}