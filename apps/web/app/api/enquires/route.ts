import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/db';
import { auth } from '../../../auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Require authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { name, organization, message, contactType } = body;

    // Validation
    if (!name || !message || !contactType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use the authenticated user's email
    const email = session.user.email;
    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Create enquiry in database
    const enquiry = await prisma.enquire.create({
      data: {
        name,
        email,
        organization: organization || null,
        message,
        contactType,
        userId: session.user.id,
        status: 'pending'
      }
    });

    // Send email notification using Resend
    try {
      await resend.emails.send({
        from: 'noreply@vidwanic.com', // You'll need to verify this domain in Resend
        to: 'mnithin1422@gmail.com',
        subject: `New Enquiry from ${name} - ${contactType.charAt(0).toUpperCase() + contactType.slice(1)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B35;">New Enquiry Received - Vidwanic</h2>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Organization:</strong> ${organization || 'Not specified'}</p>
              <p><strong>Enquiry Type:</strong> ${contactType}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3>Message</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="background: #FF6B35; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Enquiry ID:</strong> ${enquiry.id}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Please respond to this enquiry through the admin dashboard or reply directly to the customer's email: ${email}
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails - enquiry is still saved in DB
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiry: {
        id: enquiry.id,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status');
    const contactType = url.searchParams.get('contactType');

    // Build filter conditions
    const where: any = {};
    if (status) where.status = status;
    if (contactType) where.contactType = contactType;

    // Get enquiries with pagination
    const [enquiries, total] = await Promise.all([
      prisma.enquire.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.enquire.count({ where })
    ]);

    return NextResponse.json({
      enquiries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}