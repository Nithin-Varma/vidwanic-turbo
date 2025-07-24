import { auth } from "../../../auth";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar,
  TrendingUp,
  UserCheck,
  ClipboardList,
  Settings,
  BarChart3,
  Clock,
  Home,
  Mail,
  ShoppingCart,
  Package
} from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

async function getSchoolData(userId: string) {
  try {
    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { onboardedByUserId: userId },
      include: {
        students: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        teachers: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
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

    if (!schoolProfile) {
      return null;
    }

    // Get recent attendance stats
    const recentAttendance = await prisma.attendance.findMany({
      where: {
        student: {
          schoolId: schoolProfile.id
        },
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        student: {
          select: {
            name: true,
            class: true
          }
        }
      }
    });

    // Calculate attendance stats
    const totalAttendanceRecords = recentAttendance.length;
    const presentCount = recentAttendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalAttendanceRecords > 0 
      ? Math.round((presentCount / totalAttendanceRecords) * 100) 
      : 0;

    // Calculate total magazines ordered
    const totalMagazinesOrdered = schoolProfile.orders.reduce((total, order) => {
      return total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0);
    }, 0);

    return {
      schoolProfile,
      recentAttendance: recentAttendance.slice(0, 10),
      attendancePercentage,
      totalAttendanceRecords,
      totalMagazinesOrdered
    };
  } catch (error) {
    console.error('Error fetching school data:', error);
    return null;
  }
}

export default async function SchoolDashboard() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const schoolData = await getSchoolData(session.user.id);

  if (!schoolData?.schoolProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                VIDWANIC
              </Link>
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name?.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* No School Profile */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                No School Profile Found
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                You haven't completed the school onboarding process yet. Please complete the onboarding to access your school dashboard.
              </p>
              <Link
                href="/school/onboard"
                className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-4 rounded-lg inline-flex items-center"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Start School Onboarding
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { schoolProfile, recentAttendance, attendancePercentage, totalAttendanceRecords, totalMagazinesOrdered } = schoolData;

  // Show different content based on verification status
  if (!schoolProfile.isVerified) {
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
                <div className="ml-8 hidden md:block">
                  <span className="text-sm text-gray-500">School Dashboard</span>
                  <h1 className="text-lg font-semibold text-gray-900">{schoolProfile.schoolName}</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Under Review
                </div>
                <span className="text-sm text-gray-600">
                  {session.user.name?.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Under Review Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your School is Under Review
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Thank you for submitting your school registration! Our team is currently reviewing your application. 
                You'll receive an email notification once your school is verified and approved.
              </p>

              {/* School Details Card */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">School Name:</span>
                    <p className="font-medium text-gray-900">{schoolProfile.schoolName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium text-gray-900">{schoolProfile.city}, {schoolProfile.state}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">School Type:</span>
                    <p className="font-medium text-gray-900">{schoolProfile.schoolType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <p className="font-medium text-gray-900">{new Date(schoolProfile.createdAt).toLocaleDateString()}</p>
                  </div>
                  {schoolProfile.udiseCode && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">UDISE Code:</span>
                      <p className="font-medium text-gray-900">{schoolProfile.udiseCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
                    <p className="font-medium text-blue-900">Verification</p>
                    <p className="text-blue-700">We verify your school details</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
                    <p className="font-medium text-gray-600">Contact</p>
                    <p className="text-gray-500">Our team will reach out</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
                    <p className="font-medium text-gray-600">Activation</p>
                    <p className="text-gray-500">Dashboard access granted</p>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
                <a href="mailto:hello@vidwanic.com">
                  <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </div>
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
              <div className="ml-8 hidden md:block">
                <span className="text-sm text-gray-500">School Dashboard</span>
                <h1 className="text-lg font-semibold text-gray-900">{schoolProfile.schoolName}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                schoolProfile.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {schoolProfile.isVerified ? 'Verified' : 'Pending Verification'}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                schoolProfile.subscriptionStatus === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : schoolProfile.subscriptionStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {schoolProfile.subscriptionStatus.charAt(0).toUpperCase() + schoolProfile.subscriptionStatus.slice(1)}
              </div>
              <span className="text-sm text-gray-600">
                {session.user.name?.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile School Name */}
      <div className="md:hidden bg-white border-b px-4 py-3">
        <h1 className="font-semibold text-gray-900">{schoolProfile.schoolName}</h1>
        <p className="text-xs text-gray-500">School Dashboard</p>
      </div>

      {/* Dashboard Content */}
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
                    <dd className="text-lg font-medium text-gray-900">{schoolProfile._count.students}</dd>
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
                    <dd className="text-lg font-medium text-gray-900">{schoolProfile._count.teachers}</dd>
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
                    <dd className="text-lg font-medium text-gray-900">{attendancePercentage}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Magazines Ordered</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalMagazinesOrdered}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/school/students/add" 
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <Users className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-blue-900">Add Students</span>
              </Link>
              
              <Link 
                href="/school/teachers/add" 
                className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <GraduationCap className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-green-900">Add Teachers</span>
              </Link>
              
              <Link 
                href="/school/attendance" 
                className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group"
              >
                <UserCheck className="h-8 w-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-yellow-900">Take Attendance</span>
              </Link>
              
              <Link 
                href="/school/magazines" 
                className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <ShoppingCart className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-purple-900">Order Magazines</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Students */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Students</h3>
                <Link 
                  href="/school/students" 
                  className="text-sm text-vidwanic-orange hover:text-vidwanic-orange-hover"
                >
                  View All
                </Link>
              </div>
              
              {schoolProfile.students.length > 0 ? (
                <div className="space-y-3">
                  {schoolProfile.students.map((student) => (
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
                  <Link 
                    href="/school/students/add"
                    className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-sm"
                  >
                    Add your first student
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Teachers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Teachers</h3>
                <Link 
                  href="/school/teachers" 
                  className="text-sm text-vidwanic-orange hover:text-vidwanic-orange-hover"
                >
                  View All
                </Link>
              </div>
              
              {schoolProfile.teachers.length > 0 ? (
                <div className="space-y-3">
                  {schoolProfile.teachers.map((teacher) => (
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
                  <Link 
                    href="/school/teachers/add"
                    className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-sm"
                  >
                    Add your first teacher
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* School Information Card */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">School Information</h3>
              <Link 
                href="/school/profile" 
                className="text-sm text-vidwanic-orange hover:text-vidwanic-orange-hover"
              >
                Edit Profile
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">School Type</p>
                <p className="text-sm text-gray-900">{schoolProfile.schoolType}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Board Affiliation</p>
                <p className="text-sm text-gray-900">{schoolProfile.boardAffiliation || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Principal</p>
                <p className="text-sm text-gray-900">{schoolProfile.principalName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Email</p>
                <p className="text-sm text-gray-900">{schoolProfile.contactEmail}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Phone</p>
                <p className="text-sm text-gray-900">{schoolProfile.contactPhone}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-sm text-gray-900">{schoolProfile.city}, {schoolProfile.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}