"use client";

import { useState } from "react";
import { Users, BookOpen, ShoppingCart, MessageCircle, Menu, HelpCircle, Clock, School, Package, Check, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import SchoolVerificationActions from "./SchoolVerificationActions";
import EnquiriesSection from "./EnquiriesSection";

interface DashboardStats {
  totalUsers: number;
  totalPublications: number;
  totalPurchases: number;
  totalComments: number;
  totalEnquires: number;
  totalSchools: number;
  totalSchoolOrders: number;
  recentUsers: any[];
  recentPublications: any[];
  recentComments: any[];
  recentEnquires: any[];
  recentSchools: any[];
  recentSchoolOrders: any[];
}

interface User {
  name?: string;
  email: string;
}

interface AdminDashboardClientProps {
  stats: DashboardStats;
  user: User;
}

export default function AdminDashboardClient({ stats: initialStats, user }: AdminDashboardClientProps) {
  const [stats, setStats] = useState(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshEnquiries = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Force a page refresh to get updated data
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

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
                Welcome, {user.name || user.email}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                <School className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Schools</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalSchools}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">School Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalSchoolOrders}</dd>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Enquiries - Now with response functionality */}
          <EnquiriesSection 
            enquiries={stats.recentEnquires} 
            onEnquiryUpdated={refreshEnquiries}
          />

          {/* Recent Schools */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent School Registrations</h3>
              <div className="space-y-3">
                {stats.recentSchools.map((school) => (
                  <SchoolVerificationActions key={school.id} school={school} />
                ))}
              </div>
              {stats.recentSchools.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <School className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No school registrations yet</p>
                </div>
              )}
            </div>
          </div>

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

          {/* Recent School Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Magazine Orders</h3>
              <div className="space-y-3">
                {stats.recentSchoolOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{order.school.schoolName}</p>
                        <p className="text-sm text-gray-500">{order.school.city}, {order.school.state}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{order.totalAmount} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-vidwanic-orange/10 text-vidwanic-orange text-xs font-medium">
                            {item.magazine.title} ({item.quantity})
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <a 
                          href={`mailto:${order.school.contactEmail}`}
                          className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-xs"
                        >
                          Email
                        </a>
                        <a 
                          href={`tel:${order.school.contactPhone}`}
                          className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-xs"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {stats.recentSchoolOrders.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No magazine orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}