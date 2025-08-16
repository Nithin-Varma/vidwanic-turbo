"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Eye } from "lucide-react";

export default function NewPublication() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    description: "",
    price: "",
    suitableFor: "",
    coverImage: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when cover image URL changes
    if (name === 'coverImage') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push('/admin/publications');
      } else {
        const error = await response.json();
        alert('Failed to create publication: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating publication:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Link href="/admin/publications" className="ml-4 text-vidwanic-orange hover:text-vidwanic-orange-hover">
                Publications
              </Link>
              <span className="ml-4 text-gray-400">→</span>
              <span className="ml-4 text-lg font-medium text-gray-900">Add New</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/publications"
                className="text-gray-600 hover:text-gray-900 text-sm inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Publications
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Add New Publication</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                  placeholder="Enter publication title"
                />
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  id="shortDesc"
                  name="shortDesc"
                  required
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                  placeholder="Brief description for cards and listings"
                />
              </div>

              {/* Full Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                  placeholder="Detailed description of the publication"
                />
              </div>

              {/* Price and Suitable For */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="suitableFor" className="block text-sm font-medium text-gray-700 mb-2">
                    Suitable For *
                  </label>
                  <input
                    type="text"
                    id="suitableFor"
                    name="suitableFor"
                    required
                    value={formData.suitableFor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                    placeholder="e.g., Ages 8-12, Students, General Audience"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                  placeholder="https://example.com/cover-image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a URL for the cover image. For best results, use a 3:4 aspect ratio (e.g., 300x400px).
                </p>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="inline-block border border-gray-300 rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Cover preview"
                        className="w-32 h-40 object-cover"
                        onError={() => setImagePreview("")}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/publications"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vidwanic-orange"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-vidwanic-orange border border-transparent rounded-md hover:bg-vidwanic-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vidwanic-orange disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Publication
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}