"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Calendar, Users, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  description: string | null;
  shortDesc: string | null;
  coverImage: string | null;
  price: number;
  suitableFor: string | null;
  totalPurchases: number;
  schoolPurchases: number;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  purchasesCount: number;
}

interface PublicationsCarouselProps {
  publications?: Publication[];
}

const PublicationsCarousel = ({ publications = [] }: PublicationsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(5); // desktop
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3); // tablet
      } else {
        setItemsPerView(1); // mobile
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, publications.length - itemsPerView);
      return Math.min(prev + 1, maxIndex);
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  // Check if we can navigate
  const canGoNext = currentIndex < Math.max(0, publications.length - itemsPerView);
  const canGoPrev = currentIndex > 0;

  const visiblePublications = publications.slice(currentIndex, currentIndex + itemsPerView);

  if (publications.length === 0) {
    return (
      <section className="w-full bg-white py-4 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-4">
            Our Publications
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            No publications available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-vidwanic-background to-white py-8 md:py-12 lg:py-12 relative">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-vidwanic-background to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-4">
            Our Publications
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our collection of educational magazines designed to inspire and educate students
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {publications.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${
                  canGoPrev 
                    ? 'hover:bg-gray-50 cursor-pointer' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
                aria-label="Previous publications"
              >
                <ChevronLeft className={`w-6 h-6 ${canGoPrev ? 'text-gray-600' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={nextSlide}
                disabled={!canGoNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${
                  canGoNext 
                    ? 'hover:bg-gray-50 cursor-pointer' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
                aria-label="Next publications"
              >
                <ChevronRight className={`w-6 h-6 ${canGoNext ? 'text-gray-600' : 'text-gray-400'}`} />
              </button>
            </>
          )}

          {/* Publications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-8">
            {visiblePublications.map((publication) => (
              <div
                key={publication.id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-[520px] flex flex-col"
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
                  <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-white text-xs font-medium">
                      ₹{publication.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-vidwanic-text mb-2 line-clamp-2 group-hover:text-vidwanic-orange transition-colors duration-200">
                      {publication.title}
                    </h3>
                    
                    {publication.shortDesc && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {publication.shortDesc}
                      </p>
                    )}

                    {publication.suitableFor && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange text-xs font-medium">
                          <Users className="w-3 h-3 mr-1" />
                          {publication.suitableFor}
                        </span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{publication.totalPurchases} purchases</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{publication.schoolPurchases} schools</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Always at bottom */}
                  <div className="mt-auto">
                    <Link href={`/publications/${publication.id}`}>
                      <Button className="w-full bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white text-sm py-2">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {publications.length > itemsPerView && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: Math.ceil(publications.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    Math.floor(currentIndex / itemsPerView) === index
                      ? 'bg-vidwanic-orange'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/publications">
            <Button 
              variant="outline" 
              className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
            >
              View All Publications
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default PublicationsCarousel;