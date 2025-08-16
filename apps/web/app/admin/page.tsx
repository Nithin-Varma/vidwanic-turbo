import { auth } from "../../auth";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

async function getDashboardStats() {
  try {
    // Get basic stats first
    const [
      totalUsers,
      totalPublications,
      totalPurchases,
      totalComments,
      totalEnquires,
      totalSchools,
      recentUsers,
      recentPublications,
      recentComments,
      recentEnquires,
      recentSchools
    ] = await Promise.all([
      prisma.user.count(),
      prisma.magazine.count(),
      prisma.purchase.count(),
      prisma.comment.count(),
      prisma.enquire.count(),
      prisma.schoolProfile.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          isAdmin: true
        }
      }),
      prisma.magazine.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          price: true,
          totalPurchases: true,
          createdAt: true
        }
      }),
      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              name: true
            }
          },
          magazine: {
            select: {
              title: true
            }
          }
        }
      }),
      prisma.enquire.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.schoolProfile.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          onboardedBy: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    // Try to get school orders separately with error handling
    let totalSchoolOrders = 0;
    let recentSchoolOrders: any[] = [];

    try {
      totalSchoolOrders = await prisma.schoolOrder.count();
      recentSchoolOrders = await prisma.schoolOrder.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          school: {
            select: {
              schoolName: true,
              city: true,
              state: true,
              contactEmail: true,
              contactPhone: true
            }
          },
          items: {
            include: {
              magazine: {
                select: {
                  title: true
                }
              }
            }
          }
        }
      });
    } catch (schoolOrderError) {
      console.log('School orders not available yet:', schoolOrderError instanceof Error ? schoolOrderError.message : schoolOrderError);
      totalSchoolOrders = 0;
      recentSchoolOrders = [];
    }

    return {
      totalUsers,
      totalPublications,
      totalPurchases,
      totalComments,
      totalEnquires,
      totalSchools,
      totalSchoolOrders,
      recentUsers,
      recentPublications,
      recentComments,
      recentEnquires,
      recentSchools,
      recentSchoolOrders
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    redirect('/');
  }

  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardClient 
      stats={stats} 
      user={{
        name: session.user.name || undefined,
        email: session.user.email || ""
      }}
    />
  );
}