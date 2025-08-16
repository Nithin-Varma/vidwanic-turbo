import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { prisma } from '@repo/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EnquiryResponse {
  enquiryId: string;
  response: string;
  subject?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body: EnquiryResponse = await request.json();
    const { enquiryId, response, subject } = body;

    if (!enquiryId || !response) {
      return NextResponse.json(
        { error: 'Enquiry ID and response are required' },
        { status: 400 }
      );
    }

    // Get enquiry details
    const enquiry = await prisma.enquire.findUnique({
      where: { id: enquiryId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    if (!enquiry.user || !enquiry.user.email) {
      return NextResponse.json(
        { error: 'Enquiry user or email not found' },
        { status: 404 }
      );
    }

    // Update enquiry status to 'resolved'
    await prisma.enquire.update({
      where: { id: enquiryId },
      data: {
        status: 'resolved',
        adminResponse: response,
        respondedAt: new Date(),
        respondedBy: session.user.id
      }
    });

    // Send email response to user
    try {
      const emailSubject = subject || `Re: Your enquiry about ${enquiry.contactType}`;
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Response from Vidwanic Team</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Dear ${enquiry.name},</h2>
            
            <p style="color: #666;">Thank you for your enquiry. Here's our response:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
              <h3 style="color: #ff6b35; margin-top: 0;">Our Response</h3>
              <div style="color: #333; white-space: pre-wrap; line-height: 1.6;">${response}</div>
            </div>
            
            <div style="background: #e5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #1e40af;">Your Original Enquiry</h4>
              <p style="color: #1e40af; margin: 5px 0;"><strong>Type:</strong> ${enquiry.contactType}</p>
              ${enquiry.organization ? `<p style="color: #1e40af; margin: 5px 0;"><strong>Organization:</strong> ${enquiry.organization}</p>` : ''}
              <p style="color: #1e40af; margin: 5px 0;"><strong>Date:</strong> ${new Date(enquiry.createdAt).toLocaleDateString()}</p>
              <div style="color: #1e40af; margin-top: 10px;">
                <strong>Message:</strong>
                <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap;">${enquiry.message}</div>
              </div>
            </div>
            
            <p style="color: #666;">If you have any further questions, please don't hesitate to contact us.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/contact" style="background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Contact Us Again
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #ff6b35; font-weight: bold;">Best regards,</p>
              <p style="color: #999; font-size: 12px;">Team Vidwanic</p>
              <p style="color: #999; font-size: 12px;">hello@vidwanic.com</p>
            </div>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: 'Vidwanic Support <support@vidwanic.com>',
        to: [enquiry.user.email],
        subject: emailSubject,
        html: emailContent,
        replyTo: 'hello@vidwanic.com'
      });

      // Send notification to admin about the response
      try {
        const adminEmail = 'mnithin1422@gmail.com';
        
        await resend.emails.send({
          from: 'Vidwanic <admin@vidwanic.com>',
          to: [adminEmail],
          subject: `Enquiry Responded - ${enquiry.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1f2937; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Enquiry Response Sent</h1>
              </div>
              
              <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #333;">Response Sent Successfully</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Enquiry:</strong> ${enquiry.name} (${enquiry.contactType})</p>
                  <p><strong>Customer Email:</strong> ${enquiry.user.email}</p>
                  <p><strong>Admin:</strong> ${session.user.name || session.user.email}</p>
                  <p><strong>Response Date:</strong> ${new Date().toLocaleString()}</p>
                  <div style="margin-top: 15px;">
                    <strong>Response:</strong>
                    <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap;">${response}</div>
                  </div>
                </div>
              </div>
            </div>
          `
        });
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
      }

      return NextResponse.json({
        success: true,
        message: 'Response sent successfully',
        enquiry: {
          id: enquiry.id,
          status: 'resolved',
          respondedAt: new Date()
        }
      });

    } catch (emailError) {
      console.error('Failed to send email response:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email response' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error responding to enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry response' },
      { status: 500 }
    );
  }
}