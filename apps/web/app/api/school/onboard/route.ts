import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/db';
import { auth } from '../../../../auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Require authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user already has a school profile
    const existingProfile = await prisma.schoolProfile.findUnique({
      where: { onboardedByUserId: session.user.id }
    });

    if (existingProfile) {
      return NextResponse.json({ 
        error: 'You have already submitted a school onboarding request' 
      }, { status: 400 });
    }

    const body = await request.json();
    const {
      schoolName,
      udiseCode,
      address,
      city,
      state,
      pincode,
      contactPhone,
      contactEmail,
      website,
      principalName,
      principalEmail,
      principalPhone,
      onboardedByName,
      onboardedByRole,
      onboardedByPhone,
      schoolType,
      boardAffiliation,
      establishedYear,
      totalStudents,
      totalTeachers,
    } = body;

    // Validation
    if (!schoolName || !address || !city || !state || !pincode || !contactPhone || !contactEmail || 
        !principalName || !principalEmail || !principalPhone || !onboardedByName || 
        !onboardedByRole || !onboardedByPhone || !schoolType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if UDISE code already exists (if provided)
    if (udiseCode) {
      const existingUdise = await prisma.schoolProfile.findUnique({
        where: { udiseCode }
      });
      
      if (existingUdise) {
        return NextResponse.json({ 
          error: 'A school with this UDISE code is already registered' 
        }, { status: 400 });
      }
    }

    // Create school profile
    const schoolProfile = await prisma.schoolProfile.create({
      data: {
        schoolName,
        udiseCode: udiseCode || null,
        address,
        city,
        state,
        pincode,
        contactPhone,
        contactEmail,
        website: website || null,
        principalName,
        principalEmail,
        principalPhone,
        onboardedByUserId: session.user.id,
        onboardedByName,
        onboardedByRole,
        onboardedByPhone,
        schoolType,
        boardAffiliation: boardAffiliation || null,
        establishedYear: establishedYear ? parseInt(establishedYear) : null,
        totalStudents: totalStudents ? parseInt(totalStudents) : null,
        totalTeachers: totalTeachers ? parseInt(totalTeachers) : null,
        subscriptionStatus: 'pending',
        isVerified: false,
        udiseVerified: false,
      }
    });

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: 'noreply@vidwanic.com',
        to: 'mnithin1422@gmail.com',
        subject: `New School Onboarding: ${schoolName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B35;">New School Onboarding Request - Vidwanic</h2>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>School Information</h3>
              <p><strong>School Name:</strong> ${schoolName}</p>
              <p><strong>UDISE Code:</strong> ${udiseCode || 'Not provided'}</p>
              <p><strong>Address:</strong> ${address}, ${city}, ${state} - ${pincode}</p>
              <p><strong>School Type:</strong> ${schoolType}</p>
              <p><strong>Board:</strong> ${boardAffiliation || 'Not specified'}</p>
              <p><strong>Contact Phone:</strong> ${contactPhone}</p>
              <p><strong>Contact Email:</strong> ${contactEmail}</p>
              ${website ? `<p><strong>Website:</strong> ${website}</p>` : ''}
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3>Principal Information</h3>
              <p><strong>Name:</strong> ${principalName}</p>
              <p><strong>Email:</strong> ${principalEmail}</p>
              <p><strong>Phone:</strong> ${principalPhone}</p>
            </div>

            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3>Onboarded By</h3>
              <p><strong>Name:</strong> ${onboardedByName}</p>
              <p><strong>Role:</strong> ${onboardedByRole}</p>
              <p><strong>Phone:</strong> ${onboardedByPhone}</p>
              <p><strong>Email:</strong> ${session.user.email}</p>
            </div>

            ${establishedYear || totalStudents || totalTeachers ? `
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3>Additional Details</h3>
              ${establishedYear ? `<p><strong>Established:</strong> ${establishedYear}</p>` : ''}
              ${totalStudents ? `<p><strong>Total Students:</strong> ${totalStudents}</p>` : ''}
              ${totalTeachers ? `<p><strong>Total Teachers:</strong> ${totalTeachers}</p>` : ''}
            </div>
            ` : ''}
            
            <div style="background: #FF6B35; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>School Profile ID:</strong> ${schoolProfile.id}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Status:</strong> Pending Verification</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Please review this school onboarding request and verify the details through the admin dashboard.
              ${udiseCode ? 'The UDISE code can be verified through the UDISE Plus portal.' : 'No UDISE code provided - manual verification required.'}
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Continue even if email fails - school profile is still created
    }

    // Send confirmation email to the school
    try {
      await resend.emails.send({
        from: 'noreply@vidwanic.com',
        to: contactEmail,
        cc: session.user.email || undefined,
        subject: `School Onboarding Request Received - ${schoolName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B35;">Thank You for Your Interest in Vidwanic!</h2>
            
            <p>Dear ${onboardedByName},</p>
            
            <p>We have successfully received your school onboarding request for <strong>${schoolName}</strong>.</p>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B35;">
              <h3 style="margin-top: 0;">What happens next?</h3>
              <ol>
                <li><strong>Verification (1-2 days):</strong> We'll verify your school details${udiseCode ? ' using the UDISE code provided' : ' through our verification process'}.</li>
                <li><strong>Contact (2-3 days):</strong> Our team will reach out to you via phone or email to discuss subscription plans.</li>
                <li><strong>Setup (3-5 days):</strong> Once approved, we'll help you set up your school dashboard and get started.</li>
              </ol>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3>Your Submission Details</h3>
              <p><strong>School:</strong> ${schoolName}</p>
              <p><strong>Reference ID:</strong> ${schoolProfile.id}</p>
              <p><strong>Submitted on:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Status:</strong> Under Review</p>
            </div>
            
            <p>If you have any questions or need immediate assistance, please don't hesitate to contact us:</p>
            <ul>
              <li><strong>Email:</strong> hello@vidwanic.com</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
            </ul>
            
            <p>Thank you for choosing Vidwanic for your educational needs!</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This is an automated email. Please do not reply to this email address.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'School onboarding request submitted successfully',
      schoolProfile: {
        id: schoolProfile.id,
        schoolName: schoolProfile.schoolName,
        status: schoolProfile.subscriptionStatus,
        createdAt: schoolProfile.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating school profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}