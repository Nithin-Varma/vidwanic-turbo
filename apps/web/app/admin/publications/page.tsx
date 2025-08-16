"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Edit3, Trash2, Eye, Calendar, Users } from "lucide-react";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  coverImage: string | null;
  price: number;
  suitableFor: string;
  totalPurchases: number;
  schoolPurchases: number;
  createdAt: string;
  _count: {
    comments: number;
    purchases: number;
  };
}

export default function AdminPublications() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/publications');
      if (!response.ok) {
        throw new Error('Failed to fetch publications');
      }
      const data = await response.json();
      setPublications(data.data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
      setError('Failed to load publications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (publicationId: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return;
    }

    try {
      const response = await fetch(`/api/publications/${publicationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the publications list
        fetchPublications();
      } else {
        alert('Failed to delete publication');
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Network error. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-vidwanic-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading publications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Publications</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPublications}
            className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
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
              <Link href="/admin" className="text-2xl font-bold text-vidwanic-orange">
                VIDWANIC
              </Link>
              <span className="ml-4 text-gray-400">→</span>
              <span className="ml-4 text-lg font-medium text-gray-900">Manage Publications</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/publications/new"
                className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Publication
              </Link>
              <Link 
                href="/admin" 
                className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-sm"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-vidwanic-orange" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Publications</dt>
                  <dd className="text-lg font-medium text-gray-900">{publications.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Purchases</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {publications.reduce((total, pub) => total + (pub.totalPurchases || 0), 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">School Purchases</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {publications.reduce((total, pub) => total + (pub.schoolPurchases || 0), 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">All Publications</h3>
            
            {publications.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No publications yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first publication</p>
                <Link
                  href="/admin/publications/new"
                  className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Publication
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {publications.map((publication) => (
                  <div key={publication.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {publication.coverImage && (
                            <img 
                              src={publication.coverImage} 
                              alt={publication.title}
                              className="w-16 h-20 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{publication.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{publication.shortDesc}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <p className="font-medium text-gray-900">₹{publication.price}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Purchases:</span>
                            <p className="font-medium text-gray-900">{publication.totalPurchases || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">School Purchases:</span>
                            <p className="font-medium text-gray-900">{publication.schoolPurchases || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Comments:</span>
                            <p className="font-medium text-gray-900">{publication._count?.comments}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Suitable for:</span>
                          <p className="text-sm text-gray-700">{publication.suitableFor}</p>
                        </div>

                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Created {new Date(publication.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6">
                        <Link
                          href={`/publications/${publication.id}`}
                          className="p-2 text-gray-600 hover:text-vidwanic-orange hover:bg-gray-50 rounded-md transition-colors"
                          title="View Publication"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/publications/${publication.id}/edit`}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Publication"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Publication"
                          onClick={() => handleDelete(publication.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}