import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { prisma } from '@repo/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  magazineId: string;
  quantity: number;
  unitPrice: number;
}

interface OrderRequest {
  items: OrderItem[];
  deliveryAddress: string;
  deliveryContact: string;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: OrderRequest = await request.json();
    const { items, deliveryAddress, deliveryContact } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Get school profile
    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { onboardedByUserId: session.user.id },
      include: {
        onboardedBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!schoolProfile || !schoolProfile.isVerified) {
      return NextResponse.json(
        { error: 'School not found or not verified' },
        { status: 403 }
      );
    }

    // Validate magazine IDs and calculate total
    const magazineIds = items.map(item => item.magazineId);
    const magazines = await prisma.magazine.findMany({
      where: { id: { in: magazineIds } },
      select: { id: true, title: true, price: true }
    });

    if (magazines.length !== items.length) {
      return NextResponse.json(
        { error: 'Some magazines not found' },
        { status: 400 }
      );
    }

    // Verify prices and calculate total
    let totalAmount = 0;
    const validatedItems = items.map(item => {
      const magazine = magazines.find(m => m.id === item.magazineId);
      if (!magazine || magazine.price !== item.unitPrice) {
        throw new Error(`Invalid price for magazine ${item.magazineId}`);
      }
      const totalPrice = item.quantity * item.unitPrice;
      totalAmount += totalPrice;
      return {
        ...item,
        totalPrice
      };
    });

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database
    const order = await prisma.schoolOrder.create({
      data: {
        orderNumber,
        schoolId: schoolProfile.id,
        totalAmount,
        status: 'pending',
        orderType: 'magazine',
        deliveryAddress,
        deliveryContact,
        paymentStatus: 'pending',
        items: {
          create: validatedItems.map(item => ({
            magazineId: item.magazineId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }))
        }
      },
      include: {
        items: {
          include: {
            magazine: {
              select: {
                title: true,
                coverImage: true
              }
            }
          }
        }
      }
    });

    // Update magazine purchase counts
    await Promise.all(
      validatedItems.map(item =>
        prisma.magazine.update({
          where: { id: item.magazineId },
          data: {
            totalPurchases: { increment: item.quantity },
            schoolPurchases: { increment: 1 }
          }
        })
      )
    );

    // Send confirmation email to school
    try {
      await resend.emails.send({
        from: 'Vidwanic <orders@vidwanic.com>',
        to: [schoolProfile.contactEmail],
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Order Confirmation</h1>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Dear ${schoolProfile.principalName},</h2>
              
              <p style="color: #666;">Thank you for your magazine order! We've received your order and our team will reach out to you within 24 hours to confirm delivery details and payment arrangements.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ff6b35; margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>School:</strong> ${schoolProfile.schoolName}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p><strong>Status:</strong> Pending Confirmation</p>
                
                <h4 style="color: #333; margin-top: 20px;">Items Ordered:</h4>
                <ul style="list-style: none; padding: 0;">
                  ${order.items.map(item => `
                    <li style="background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 4px;">
                      <strong>${item.magazine.title}</strong><br>
                      Quantity: ${item.quantity} × ₹${item.unitPrice} = ₹${item.totalPrice}
                    </li>
                  `).join('')}
                </ul>
                
                <h4 style="color: #333; margin-top: 20px;">Delivery Information:</h4>
                <p><strong>Address:</strong> ${deliveryAddress}</p>
                <p><strong>Contact:</strong> ${deliveryContact}</p>
              </div>
              
              <p style="color: #666;">Our team will contact you shortly to:</p>
              <ul style="color: #666;">
                <li>Confirm delivery details and timeline</li>
                <li>Arrange payment method (bank transfer, cheque, or online)</li>
                <li>Provide tracking information</li>
              </ul>
              
              <p style="color: #666;">If you have any questions, please don't hesitate to contact us at <a href="mailto:orders@vidwanic.com">orders@vidwanic.com</a> or call us at +91 98765 43210.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #ff6b35; font-weight: bold;">Thank you for choosing Vidwanic!</p>
                <p style="color: #999; font-size: 12px;">Team Vidwanic</p>
              </div>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Send notification email to admin
    try {
      const adminEmail = 'mnithin1422@gmail.com';
      
      await resend.emails.send({
        from: 'Vidwanic <orders@vidwanic.com>',
        to: [adminEmail],
        subject: `New Magazine Order - ${orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1f2937; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Magazine Order</h1>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Order Details</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>School:</strong> ${schoolProfile.schoolName}</p>
                <p><strong>Principal:</strong> ${schoolProfile.principalName}</p>
                <p><strong>Location:</strong> ${schoolProfile.city}, ${schoolProfile.state}</p>
                <p><strong>Contact Email:</strong> ${schoolProfile.contactEmail}</p>
                <p><strong>Contact Phone:</strong> ${schoolProfile.contactPhone}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
                
                <h4 style="color: #333; margin-top: 20px;">Items Ordered:</h4>
                <ul style="list-style: none; padding: 0;">
                  ${order.items.map(item => `
                    <li style="background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 4px;">
                      <strong>${item.magazine.title}</strong><br>
                      Quantity: ${item.quantity} × ₹${item.unitPrice} = ₹${item.totalPrice}
                    </li>
                  `).join('')}
                </ul>
                
                <h4 style="color: #333; margin-top: 20px;">Delivery Information:</h4>
                <p><strong>Address:</strong> ${deliveryAddress}</p>
                <p><strong>Contact:</strong> ${deliveryContact}</p>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;"><strong>Action Required:</strong> Please reach out to the school to confirm delivery details and payment arrangements.</p>
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
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}