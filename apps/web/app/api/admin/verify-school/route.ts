import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { prisma } from '@repo/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface VerificationRequest {
  schoolId: string;
  approve: boolean;
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

    const body: VerificationRequest = await request.json();
    const { schoolId, approve } = body;

    if (!schoolId || typeof approve !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get school details before updating
    const school = await prisma.schoolProfile.findUnique({
      where: { id: schoolId },
      include: {
        onboardedBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    // Update school verification status
    const updatedSchool = await prisma.schoolProfile.update({
      where: { id: schoolId },
      data: {
        isVerified: approve,
        verificationNotes: approve 
          ? `Approved by ${session.user.name || session.user.email} on ${new Date().toISOString()}`
          : `Rejected by ${session.user.name || session.user.email} on ${new Date().toISOString()}`,
        subscriptionStatus: approve ? 'active' : 'cancelled'
      }
    });

    // Send notification email to school
    try {
      const emailSubject = approve 
        ? `🎉 School Verification Approved - ${school.schoolName}`
        : `School Verification Update - ${school.schoolName}`;

      const emailContent = approve 
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🎉 Congratulations!</h1>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Dear ${school.principalName},</h2>
              
              <p style="color: #666;">Great news! Your school has been successfully verified and approved for Vidwanic's educational magazine service.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ff6b35; margin-top: 0;">School Details</h3>
                <p><strong>School Name:</strong> ${school.schoolName}</p>
                <p><strong>Location:</strong> ${school.city}, ${school.state}</p>
                <p><strong>Verification Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Verified & Active</span></p>
              </div>
              
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1e40af;">What's Next?</h4>
                <ul style="color: #1e40af; margin: 0;">
                  <li>Access your school dashboard to manage students and teachers</li>
                  <li>Browse and order magazines for your students</li>
                  <li>Track orders and manage subscriptions</li>
                  <li>Get dedicated support from our team</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/school/dashboard" style="background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Access Your Dashboard
                </a>
              </div>
              
              <p style="color: #666;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #ff6b35; font-weight: bold;">Welcome to the Vidwanic family!</p>
                <p style="color: #999; font-size: 12px;">Team Vidwanic</p>
              </div>
            </div>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Verification Update</h1>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Dear ${school.principalName},</h2>
              
              <p style="color: #666;">Thank you for your interest in Vidwanic. After reviewing your school application, we need additional information before we can proceed with verification.</p>
              
              <div style="background: #fee2e2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p style="color: #991b1b; margin: 0;">Please contact our support team to discuss the verification requirements and next steps.</p>
              </div>
              
              <p style="color: #666;">Our team is here to help you through the process. Please reach out to us for assistance.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 12px;">Team Vidwanic</p>
              </div>
            </div>
          </div>
        `;

      await resend.emails.send({
        from: 'Vidwanic <schools@vidwanic.com>',
        to: [school.contactEmail],
        subject: emailSubject,
        html: emailContent
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // Send notification to admin about the action
    try {
      const adminEmail = 'mnithin1422@gmail.com';
      
      await resend.emails.send({
        from: 'Vidwanic <admin@vidwanic.com>',
        to: [adminEmail],
        subject: `School ${approve ? 'Approved' : 'Rejected'} - ${school.schoolName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1f2937; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">School ${approve ? 'Approved' : 'Rejected'}</h1>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Verification Action Completed</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>School:</strong> ${school.schoolName}</p>
                <p><strong>Location:</strong> ${school.city}, ${school.state}</p>
                <p><strong>Action:</strong> ${approve ? 'Approved' : 'Rejected'}</p>
                <p><strong>Admin:</strong> ${session.user.name || session.user.email}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
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
      message: `School ${approve ? 'approved' : 'rejected'} successfully`,
      school: updatedSchool
    });

  } catch (error) {
    console.error('Error updating school verification:', error);
    return NextResponse.json(
      { error: 'Failed to update school verification' },
      { status: 500 }
    );
  }
}