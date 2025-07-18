import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

const HeroSection = () => (
  <section className="w-full bg-vidwanic-background py-8 md:py-12 lg:py-16 relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-vidwanic-peach rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-vidwanic-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
    </div>

    <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center px-4 md:px-8 lg:px-0 min-h-[500px] lg:min-h-[600px]">
      {/* Left: Content */}
      <div className="z-10 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Monthly Student Magazine
          </span>
        </div>
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-vidwanic-text mb-6">
          Making Learning
          <span className="block text-vidwanic-orange">Fun & Simple</span>
        </h1>
        {/* Mobile Image - appears here on mobile only */}
        <div className="lg:hidden flex justify-center mb-8">
          <div className="relative max-w-full w-full">
            <Image
              src="/heroimage1.svg"
              alt="Students reading Vidwanic Magazine - making learning fun and simple"
              width={1000}
              height={800}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl lg:max-w-none">
          Vidwanic is a monthly student magazine designed for schools and students across India. 
          We explore real-world topics spanning technology, science, economics, career guidance, 
          and personal development through engaging stories, interactive activities, and thought-provoking content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
          <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl text-lg">
            Explore Latest Issue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200">
            Subscribe for Schools
          </Button>
        </div>
        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vidwanic-orange/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-vidwanic-orange" />
            </div>
            <div>
              <p className="font-semibold text-vidwanic-text">50+ Articles</p>
              <p className="text-sm text-gray-600">Per Issue</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vidwanic-orange/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-vidwanic-orange" />
            </div>
            <div>
              <p className="font-semibold text-vidwanic-text">500+ Schools</p>
              <p className="text-sm text-gray-600">Trust Us</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Image - Desktop only, overlaps left */}
      <div className="hidden lg:block relative h-full">
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[700px] xl:w-[900px] 2xl:w-[1100px] max-w-none">
          <Image
            src="/heroimage1.svg"
            alt="Students reading Vidwanic Magazine - making learning fun and simple"
            width={2000}
            height={1600}
            className="w-full h-auto drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;