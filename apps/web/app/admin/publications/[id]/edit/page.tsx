"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { convertGoogleDriveUrl, isGoogleDriveUrl } from "../../../../lib/utils";

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
}

export default function EditPublication() {
  const router = useRouter();
  const params = useParams();
  const publicationId = params.id as string;

  const [publication, setPublication] = useState<Publication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDesc: "",
    coverImage: "",
    price: 0,
    suitableFor: "",
    totalPurchases: 0,
    schoolPurchases: 0,
  });

  useEffect(() => {
    if (publicationId) {
      fetchPublication();
    }
  }, [publicationId]);

  const fetchPublication = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/publications/${publicationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch publication');
      }
      const data = await response.json();
      const pub = data.data;
      setPublication(pub);
      setFormData({
        title: pub.title || "",
        description: pub.description || "",
        shortDesc: pub.shortDesc || "",
        coverImage: pub.coverImage || "",
        price: pub.price || 0,
        suitableFor: pub.suitableFor || "",
        totalPurchases: pub.totalPurchases || 0,
        schoolPurchases: pub.schoolPurchases || 0,
      });
    } catch (error) {
      console.error('Error fetching publication:', error);
      setError('Failed to load publication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/publications/${publicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/publications');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update publication');
      }
    } catch (error) {
      console.error('Error updating publication:', error);
      setError(error instanceof Error ? error.message : 'Failed to update publication');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'totalPurchases' || name === 'schoolPurchases' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 border-4 border-vidwanic-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading publication...</p>
        </div>
      </div>
    );
  }

  if (error && !publication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Publication</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/admin/publications"
            className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Publications
          </Link>
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
              <Link href="/admin/publications" className="ml-4 text-gray-600 hover:text-vidwanic-orange">
                Publications
              </Link>
              <span className="ml-4 text-gray-400">→</span>
              <span className="ml-4 text-lg font-medium text-gray-900">Edit Publication</span>
            </div>
            <Link 
              href="/admin/publications" 
              className="text-vidwanic-orange hover:text-vidwanic-orange-hover text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Publications
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Publication</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <Input
                  type="text"
                  id="shortDesc"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <Input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can use Google Drive sharing links. The system will automatically convert them to direct image URLs.
                </p>
                
                {/* Image Preview */}
                {formData.coverImage && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <div className="relative w-32 h-40 border border-gray-300 rounded-md overflow-hidden">
                      <img
                        src={convertGoogleDriveUrl(formData.coverImage)}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center w-full h-full bg-gray-100">
                                <div class="text-center">
                                  <ImageIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p class="text-xs text-gray-500">Invalid image URL</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    {isGoogleDriveUrl(formData.coverImage) && (
                      <p className="mt-2 text-xs text-blue-600">
                        ✓ Google Drive link detected - will be converted automatically
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="suitableFor" className="block text-sm font-medium text-gray-700 mb-2">
                  Suitable For
                </label>
                <Input
                  type="text"
                  id="suitableFor"
                  name="suitableFor"
                  value={formData.suitableFor}
                  onChange={handleInputChange}
                  placeholder="e.g., Class 6-8, High School Students"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="totalPurchases" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Purchases
                  </label>
                  <Input
                    type="number"
                    id="totalPurchases"
                    name="totalPurchases"
                    value={formData.totalPurchases}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="schoolPurchases" className="block text-sm font-medium text-gray-700 mb-2">
                    School Purchases
                  </label>
                  <Input
                    type="number"
                    id="schoolPurchases"
                    name="schoolPurchases"
                    value={formData.schoolPurchases}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/publications"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
