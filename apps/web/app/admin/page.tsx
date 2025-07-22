import { auth } from "../../auth";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { Users, BookOpen, ShoppingCart, MessageCircle, Menu, HelpCircle, Clock } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  try {
    const [
      totalUsers,
      totalPublications,
      totalPurchases,
      totalComments,
      totalEnquires,
      recentUsers,
      recentPublications,
      recentComments,
      recentEnquires
    ] = await Promise.all([
      prisma.user.count(),
      prisma.magazine.count(),
      prisma.purchase.count(),
      prisma.comment.count(),
      prisma.enquire.count(),
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
      })
    ]);

    return {
      totalUsers,
      totalPublications,
      totalPurchases,
      totalComments,
      totalEnquires,
      recentUsers,
      recentPublications,
      recentComments,
      recentEnquires
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                VIDWANIC
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-gray-600">
                Welcome, {session.user.name || session.user.email}
              </span>
              <Link 
                href="/" 
                className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-sm"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title - Mobile Only */}
      <div className="sm:hidden bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Publications</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalPublications}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Comments</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalComments}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Enquiries</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalEnquires}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Purchases</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalPurchases}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-6 sm:mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link 
                href="/admin/publications/new" 
                className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Add New Publication
              </Link>
              <Link 
                href="/admin/publications" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Manage Publications
              </Link>
              <Link 
                href="/admin/users" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Users */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      {user.isAdmin && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vidwanic-orange text-white mb-1">
                          Admin
                        </span>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Publications */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Publications</h3>
              <div className="space-y-3">
                {stats.recentPublications.map((publication) => (
                  <div key={publication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{publication.title}</p>
                      <p className="text-sm text-gray-500">₹{publication.price} • {publication.totalPurchases} purchases</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(publication.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Enquiries</h3>
              <div className="space-y-3">
                {stats.recentEnquires.map((enquiry) => (
                  <div key={enquiry.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{enquiry.name}</p>
                        <p className="text-sm text-gray-500">{enquiry.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          enquiry.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : enquiry.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : enquiry.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {enquiry.status}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-vidwanic-orange/10 text-vidwanic-orange text-xs font-medium">
                        {enquiry.contactType}
                      </span>
                      {enquiry.organization && (
                        <span className="ml-2 text-xs text-gray-500">
                          from {enquiry.organization}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{enquiry.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(enquiry.createdAt).toLocaleDateString()} at {new Date(enquiry.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
              {stats.recentEnquires.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No enquiries yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}