import { auth } from "../../../auth";
import { prisma } from "@repo/db";
import { redirect, notFound } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCheck,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface SchoolDashboardProps {
  params: {
    schoolname: string;
  };
}

function normalizeSchoolName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function getSchoolBySlug(schoolSlug: string) {
  try {
    // Get all schools and find the one that matches the slug
    const schools = await prisma.schoolProfile.findMany({
      include: {
        onboardedBy: {
          select: {
            name: true,
            email: true
          }
        },
        students: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            class: true,
            section: true,
            createdAt: true
          }
        },
        teachers: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            subject: true,
            experience: true,
            createdAt: true
          }
        },
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
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
        },
        _count: {
          select: {
            students: true,
            teachers: true,
            orders: true
          }
        }
      }
    });

    // Find school that matches the slug
    const school = schools.find(s => 
      normalizeSchoolName(s.schoolName) === schoolSlug
    );

    if (!school) {
      return null;
    }

    // Calculate some stats
    const totalMagazinesOrdered = school.orders.reduce((total, order) => {
      return total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0);
    }, 0);

    // Get recent attendance stats (mock for now since we don't have real attendance data)
    const attendancePercentage = 85; // Mock data

    return {
      school,
      stats: {
        totalStudents: school._count.students,
        totalTeachers: school._count.teachers,
        totalOrders: school._count.orders,
        totalMagazinesOrdered,
        attendancePercentage
      }
    };
  } catch (error) {
    console.error('Error fetching school:', error);
    return null;
  }
}

export default async function SchoolDashboard({ params }: SchoolDashboardProps) {
  const session = await auth();
  const { schoolname } = params;

  // Get school data
  const schoolData = await getSchoolBySlug(schoolname);

  if (!schoolData) {
    notFound();
  }

  const { school, stats } = schoolData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-vidwanic-orange hover:text-vidwanic-orange-hover mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                  VIDWANIC
                </Link>
                <span className="ml-4 text-sm text-gray-500">School Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                school.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {school.isVerified ? 'Verified' : 'Pending Verification'}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                school.subscriptionStatus === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : school.subscriptionStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {school.subscriptionStatus.charAt(0).toUpperCase() + school.subscriptionStatus.slice(1)}
              </div>
              {session?.user?.isAdmin && (
                <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                  Admin View
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* School Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{school.schoolName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{school.address}, {school.city}, {school.state} - {school.pincode}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${school.contactEmail}`} className="hover:text-vidwanic-orange">
                    {school.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${school.contactPhone}`} className="hover:text-vidwanic-orange">
                    {school.contactPhone}
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Registered by</div>
                <div className="font-medium">{school.onboardedBy.name}</div>
                <div className="text-sm text-gray-500">{school.onboardedByRole}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalStudents}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalTeachers}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Attendance Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.attendancePercentage}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Magazine Orders</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Students */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Students</h3>
                <span className="text-sm text-gray-500">{stats.totalStudents} total</span>
              </div>
              
              {school.students.length > 0 ? (
                <div className="space-y-3">
                  {school.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Class {student.class}{student.section ? ` - ${student.section}` : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Added {new Date(student.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No students added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Teachers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Teachers</h3>
                <span className="text-sm text-gray-500">{stats.totalTeachers} total</span>
              </div>
              
              {school.teachers.length > 0 ? (
                <div className="space-y-3">
                  {school.teachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-sm text-gray-500">
                          {teacher.subject || 'General'} • {teacher.experience || 0} years exp.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Added {new Date(teacher.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No teachers added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                <span className="text-sm text-gray-500">{stats.totalOrders} total</span>
              </div>
              
              {school.orders.length > 0 ? (
                <div className="space-y-3">
                  {school.orders.map((order) => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        ₹{order.totalAmount} • {order.items.length} items
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">School Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">School Type</p>
                <p className="text-sm text-gray-900">{school.schoolType}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Board Affiliation</p>
                <p className="text-sm text-gray-900">{school.boardAffiliation || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">UDISE Code</p>
                <p className="text-sm text-gray-900">{school.udiseCode || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Principal</p>
                <p className="text-sm text-gray-900">{school.principalName}</p>
                <p className="text-xs text-gray-500">{school.principalEmail}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Established</p>
                <p className="text-sm text-gray-900">{school.establishedYear || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Registration Date</p>
                <p className="text-sm text-gray-900">{new Date(school.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {school.website && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Website</p>
                <a 
                  href={school.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-vidwanic-orange hover:text-vidwanic-orange-hover"
                >
                  {school.website}
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: SchoolDashboardProps) {
  const schoolData = await getSchoolBySlug(params.schoolname);
  
  if (!schoolData) {
    return {
      title: 'School Not Found - Vidwanic'
    };
  }

  return {
    title: `${schoolData.school.schoolName} - School Dashboard | Vidwanic`,
    description: `View detailed dashboard for ${schoolData.school.schoolName} including students, teachers, and order information.`
  };
}