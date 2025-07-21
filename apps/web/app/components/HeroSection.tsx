"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import Loader from "./Loader";

const HeroSection = () => {
  const [loading, setLoading] = useState(true);

  // Handler for image load
  const handleImageLoad = () => setLoading(false);

  return (
    <section className="w-full bg-vidwanic-background py-8 md:py-8 lg:py-8 relative overflow-hidden">
      {/* Loader overlay */}
      {loading && <Loader />}
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-vidwanic-peach rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-vidwanic-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-4 md:px-8 lg:px-0 min-h-[500px] md:min-h-[600px] lg:min-h-[650px]">
        {/* Left: Content */}
        <div className="z-10 max-w-xl mx-auto md:mx-0 text-center md:text-left order-2 md:order-1">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Monthly Student Magazine
            </span>
          </div>
          <h1 className="font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight text-vidwanic-text mb-6">
            Making Learning
            <span className="block mt-2 text-vidwanic-orange">Fun & Simple</span>
          </h1>
          <p className="text-base sm:text-lg md:text-base lg:text-lg xl:text-xl text-gray-600 mb-8 leading-relaxed">
            Vidwanic is a monthly student magazine designed for schools and students across India. 
            We explore real-world topics spanning technology, science, economics, career guidance, 
            and personal development through engaging stories, interactive activities, and thought-provoking content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
            <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl text-base lg:text-lg">
              Explore Latest Issue
              <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-full text-base lg:text-lg transition-all duration-200">
              Subscribe for Schools
            </Button>
          </div>
          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 lg:w-10 h-8 lg:h-10 bg-vidwanic-orange/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 lg:w-5 h-4 lg:h-5 text-vidwanic-orange" />
              </div>
              <div>
                <p className="font-semibold text-vidwanic-text text-sm lg:text-base">50+ Articles</p>
                <p className="text-xs lg:text-sm text-gray-600">Per Issue</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 lg:w-10 h-8 lg:h-10 bg-vidwanic-orange/10 rounded-full flex items-center justify-center">
                <Users className="w-4 lg:w-5 h-4 lg:h-5 text-vidwanic-orange" />
              </div>
              <div>
                <p className="font-semibold text-vidwanic-text text-sm lg:text-base">500+ Schools</p>
                <p className="text-xs lg:text-sm text-gray-600">Trust Us</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Image - Responsive */}
        <div className="relative order-1 md:order-2 mb-8 md:mb-0">
          {/* Mobile/Small screens - centered */}
          <div className="md:hidden flex justify-center">
            <div className="relative w-full max-w-sm">
              <Image
                src="/heroimage1.svg"
                alt="Students reading Vidwanic Magazine - making learning fun and simple"
                width={400}
                height={320}
                className="w-full h-auto drop-shadow-2xl"
                priority
                onLoad={handleImageLoad}
              />
            </div>
          </div>
          
          {/* Tablet and Desktop - side by side */}
          <div className="hidden md:block relative h-full">
            <div className="md:absolute md:left-[-5%] lg:left-[-10%] md:top-1/2 md:-translate-y-1/2 md:w-[120%] lg:w-[130%] xl:w-[140%] 2xl:w-[150%]">
              <Image
                src="/heroimage1.svg"
                alt="Students reading Vidwanic Magazine - making learning fun and simple"
                width={800}
                height={640}
                className="w-full h-auto drop-shadow-2xl"
                priority
                onLoad={handleImageLoad}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;