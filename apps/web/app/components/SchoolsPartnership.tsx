"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ChevronDown, GraduationCap } from "lucide-react";
import Image from "next/image";

const SchoolsPartnership = () => {
  const [showAll, setShowAll] = useState(false);

  const partnerSchools = [
    {
      id: 1,
      name: "Delhi Public School",
      location: "New Delhi",
      logo: "/school-logos/dps.png"
    },
    {
      id: 2,
      name: "Kendriya Vidyalaya",
      location: "Mumbai",
      logo: "/school-logos/kv.png"
    },
    {
      id: 3,
      name: "Ryan International School",
      location: "Bangalore",
      logo: "/school-logos/ryan.png"
    },
    {
      id: 4,
      name: "St. Xavier's School",
      location: "Kolkata",
      logo: "/school-logos/st-xaviers.png"
    },
    {
      id: 5,
      name: "Modern School",
      location: "Gurgaon",
      logo: "/school-logos/modern.png"
    },
    {
      id: 6,
      name: "DAV Public School",
      location: "Chennai",
      logo: "/school-logos/dav.png"
    },
    {
      id: 7,
      name: "Army Public School",
      location: "Pune",
      logo: "/school-logos/aps.png"
    },
    {
      id: 8,
      name: "Sardar Patel Vidyalaya",
      location: "New Delhi",
      logo: "/school-logos/spv.png"
    },
    {
      id: 9,
      name: "The Heritage School",
      location: "Hyderabad",
      logo: "/school-logos/heritage.png"
    },
    {
      id: 10,
      name: "Birla Vidya Niketan",
      location: "New Delhi",
      logo: "/school-logos/birla.png"
    },
    {
      id: 11,
      name: "Navodaya Vidyalaya",
      location: "Jaipur",
      logo: "/school-logos/navodaya.png"
    },
    {
      id: 12,
      name: "Lotus Valley International School",
      location: "Noida",
      logo: "/school-logos/lotus.png"
    }
  ];

  const visibleSchools = showAll ? partnerSchools : partnerSchools.slice(0, 6);

  return (
    <section className="w-full bg-white py-20 md:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-vidwanic-peach/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-vidwanic-pink/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-6">
            <GraduationCap className="w-4 h-4 mr-2" />
            Trusted by Leading Schools
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-6">
            Schools That Partner
            <span className="block text-vidwanic-orange">With Us</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Over 500+ schools across India trust Vidwanic to enhance their students' learning experience with our engaging educational content.
          </p>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-12">
          {visibleSchools.map((school) => (
            <div
              key={school.id}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-vidwanic-orange/30"
            >
              <div className="text-center">
                {/* School Logo Placeholder */}
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-vidwanic-orange/10 to-vidwanic-pink/10 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-vidwanic-orange" />
                </div>
                
                {/* School Info */}
                <h3 className="font-bold text-sm md:text-base text-vidwanic-text mb-1 group-hover:text-vidwanic-orange transition-colors duration-200">
                  {school.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {school.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 text-lg"
          >
            {showAll ? "View Less" : "View More Schools"}
            <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-vidwanic-orange mb-2">500+</div>
            <div className="text-lg font-medium text-vidwanic-text mb-1">Partner Schools</div>
            <div className="text-sm text-gray-600">Across India</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-vidwanic-orange mb-2">50k+</div>
            <div className="text-lg font-medium text-vidwanic-text mb-1">Students Engaged</div>
            <div className="text-sm text-gray-600">Monthly Readers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-vidwanic-orange mb-2">15+</div>
            <div className="text-lg font-medium text-vidwanic-text mb-1">States Covered</div>
            <div className="text-sm text-gray-600">Pan India Presence</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default SchoolsPartnership;