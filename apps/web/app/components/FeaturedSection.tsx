import { Button } from "@repo/ui/components/ui/button";
import { BookOpen, Eye, Download } from "lucide-react";
import Image from "next/image";

const FeaturedSection = () => (
  <section className="w-full bg-white py-16 md:py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-4">
          Featured This Month
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our latest issue packed with engaging content across multiple subjects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Magazine Cover */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative group">
            <div className="w-80 h-96 bg-gradient-to-br from-vidwanic-orange to-vidwanic-orange-hover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <div className="text-white text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Issue #24</h3>
                <p className="text-lg opacity-90">November 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-4">
              <Eye className="w-4 h-4 mr-2" />
              Latest Issue
            </span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-vidwanic-text mb-6">
            "The Future of Learning"
          </h3>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            This month's issue explores how technology is reshaping education, career opportunities 
            in emerging fields, financial literacy for students, and inspiring stories of young innovators 
            making a difference in their communities.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-vidwanic-orange rounded-full"></div>
              <span className="text-gray-700">Technology & Innovation</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-vidwanic-orange rounded-full"></div>
              <span className="text-gray-700">Career Guidance & Skills</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-vidwanic-orange rounded-full"></div>
              <span className="text-gray-700">Financial Literacy</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-2 h-2 bg-vidwanic-orange rounded-full"></div>
              <span className="text-gray-700">Student Success Stories</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
              <Eye className="w-5 h-5 mr-2" />
              Read Preview
            </Button>
            <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200">
              <Download className="w-5 h-5 mr-2" />
              Download Sample
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturedSection;