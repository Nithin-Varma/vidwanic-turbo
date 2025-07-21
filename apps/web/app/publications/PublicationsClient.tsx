"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Search, Filter, Calendar, Users, Star, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  publications: any[];
}

export default function PublicationsClient({ publications }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredAndSortedPublications = publications
    .filter(pub => 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.description && pub.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pub.suitableFor && pub.suitableFor.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return b.totalPurchases - a.totalPurchases;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  return (
    <main className="min-h-screen bg-vidwanic-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-vidwanic-orange to-vidwanic-orange-hover text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            All Publications
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Explore our complete collection of educational magazines
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vidwanic-orange focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-vidwanic-orange focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filteredAndSortedPublications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Publications Found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'No publications available at the moment'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredAndSortedPublications.length} of {publications.length} publications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedPublications.map((publication: any) => (
                  <div
                    key={publication.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-[580px] flex flex-col"
                  >
                    {/* Cover Image */}
                    <div className="relative h-64 bg-gradient-to-br from-vidwanic-orange to-vidwanic-orange-hover flex-shrink-0">
                      {publication.coverImage ? (
                        <Image
                          src={publication.coverImage}
                          alt={publication.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <div className="text-center">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-80" />
                            <p className="text-sm opacity-90">No Cover</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-medium">
                          ₹{publication.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-vidwanic-text mb-2 line-clamp-2 group-hover:text-vidwanic-orange transition-colors duration-200">
                          {publication.title}
                        </h3>
                        
                        {publication.shortDesc && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {publication.shortDesc}
                          </p>
                        )}

                        {publication.suitableFor && (
                          <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange text-sm font-medium">
                              <Users className="w-4 h-4 mr-1" />
                              {publication.suitableFor}
                            </span>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{publication.totalPurchases} purchases</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{publication.schoolPurchases} schools</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 mb-4">
                          Published: {new Date(publication.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions - Always at bottom */}
                      <div className="mt-auto">
                        <Link href={`/publications/${publication.id}`}>
                          <Button className="w-full bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-2">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}