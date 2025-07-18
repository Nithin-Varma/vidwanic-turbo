import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

const HeroSection = () => (
  <section className="w-full bg-vidwanic-background py-16 md:py-24 lg:py-32 relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-vidwanic-peach rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-vidwanic-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Left: Content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
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
            <div className="relative max-w-md">
              <Image
                src="/heroimage.svg"
                alt="Students reading Vidwanic Magazine - making learning fun and simple"
                width={500}
                height={400}
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
        
        {/* Right: Image - Desktop only */}
        <div className="hidden lg:flex flex-1 justify-center lg:justify-end w-full max-w-4xl xl:max-w-5xl">
          <div className="relative w-full flex items-end">
            <Image
              src="/heroimage.svg"
              alt="Students reading Vidwanic Magazine - making learning fun and simple"
              width={1000}
              height={800}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;