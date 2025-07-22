"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Image from "next/image";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "Principal",
      school: "Delhi Public School, Gurgaon",
      image: "/testimonials/principal1.jpg",
      content: "Vidwanic has transformed how our students engage with learning. The content is well-researched, age-appropriate, and perfectly aligned with our educational goals. Our students eagerly wait for each monthly issue.",
      rating: 5
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Science Teacher",
      school: "Kendriya Vidyalaya, Mumbai",
      image: "/testimonials/teacher1.jpg",
      content: "The science articles in Vidwanic are exceptional. They break down complex concepts into digestible, interesting stories that make my job as a teacher so much easier. Students are more curious than ever.",
      rating: 5
    },
    {
      id: 3,
      name: "Anita Mehta",
      role: "Parent",
      school: "Mother of Class 8 student",
      image: "/testimonials/parent1.jpg",
      content: "My daughter has developed a genuine love for reading thanks to Vidwanic. The articles are informative yet entertaining, and I've noticed significant improvement in her general knowledge and analytical thinking.",
      rating: 5
    },
    {
      id: 4,
      name: "Arjun Patel",
      role: "Student",
      school: "Class 10, Ryan International School",
      image: "/testimonials/student1.jpg",
      content: "Vidwanic is nothing like boring textbooks! The technology and career guidance articles have helped me understand what I want to pursue after school. It's like having a cool mentor guide you through different topics.",
      rating: 5
    },
    {
      id: 5,
      name: "Mrs. Sunita Joshi",
      role: "Vice Principal",
      school: "St. Xavier's School, Kolkata",
      image: "/testimonials/principal2.jpg",
      content: "We've been subscribing to Vidwanic for two years now. The quality is consistently excellent, and it complements our curriculum beautifully. Teachers use it as a reference for current affairs and project work.",
      rating: 5
    },
    {
      id: 6,
      name: "Kavya Reddy",
      role: "Student",
      school: "Class 12, Narayana School, Hyderabad",
      image: "/testimonials/student2.jpg",
      content: "The career guidance section in Vidwanic opened my eyes to so many possibilities I never knew existed. It helped me make informed decisions about my future studies and career path.",
      rating: 5
    }
  ];

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3); // desktop
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2); // tablet
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
      const maxIndex = Math.max(0, testimonials.length - itemsPerView);
      return Math.min(prev + 1, maxIndex);
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const canGoNext = currentIndex < Math.max(0, testimonials.length - itemsPerView);
  const canGoPrev = currentIndex > 0;

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-20 lg:py-24 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-vidwanic-peach/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-vidwanic-pink/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-6">
            <Star className="w-4 h-4 mr-2" />
            What People Say
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-6">
            Loved by Students,
            <span className="block text-vidwanic-orange">Trusted by Educators</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from the schools, teachers, students, and parents who have experienced the Vidwanic difference firsthand.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${
                  canGoPrev 
                    ? 'hover:bg-gray-50 cursor-pointer' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
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
              >
                <ChevronRight className={`w-6 h-6 ${canGoNext ? 'text-gray-600' : 'text-gray-400'}`} />
              </button>
            </>
          )}

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-vidwanic-orange/30 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-8 h-8 text-vidwanic-orange" />
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar Placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-vidwanic-orange to-vidwanic-pink rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-vidwanic-text">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-vidwanic-orange font-medium">
                        {testimonial.school}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {testimonials.length > itemsPerView && (
            <div className="flex justify-center mt-12 gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    Math.floor(currentIndex / itemsPerView) === index
                      ? 'bg-vidwanic-orange'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-vidwanic-text mb-4">
            Ready to Join Our Community?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the difference Vidwanic can make in your educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-3 rounded-full">
              Subscribe for Schools
            </Button>
            <Button 
              variant="outline"
              className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-3 rounded-full"
            >
              View Sample Issue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;