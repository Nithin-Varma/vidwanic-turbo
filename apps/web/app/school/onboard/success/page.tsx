"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home, LayoutDashboard, ArrowRight, School, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

const OnboardingSuccessPage = () => {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    // Auto-hide confetti effect after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vidwanic-background via-white to-vidwanic-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-20 w-64 h-64 bg-vidwanic-peach rounded-full mix-blend-multiply filter blur-xl opacity-70 ${showConfetti ? 'animate-bounce' : ''}`}></div>
        <div className={`absolute bottom-20 right-20 w-72 h-72 bg-vidwanic-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 ${showConfetti ? 'animate-pulse' : ''}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vidwanic-orange/20 rounded-full mix-blend-multiply filter blur-2xl opacity-50 ${showConfetti ? 'animate-ping' : ''}`}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
              VIDWANIC
            </Link>
            <div className="text-sm text-gray-600">
              Application Submitted Successfully
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Success Animation */}
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 transition-all duration-1000 ${showConfetti ? 'scale-110' : 'scale-100'}`}>
            <CheckCircle className={`w-12 h-12 text-green-600 transition-all duration-1000 ${showConfetti ? 'animate-pulse' : ''}`} />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-vidwanic-text mb-6">
            🎉 Application Submitted Successfully!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Thank you for choosing Vidwanic! Your school onboarding application has been received and is being reviewed by our team.
          </p>

          {/* Application Details Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <School className="w-8 h-8 text-vidwanic-orange mr-3" />
              <h2 className="text-2xl font-bold text-vidwanic-text">Application Details</h2>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Application ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{schoolId || 'Loading...'}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1" />
                  Under Review
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Submitted:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Expected Response:</span>
                <span className="text-gray-900">2-3 Business Days</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3">1</div>
                <h4 className="font-semibold text-blue-900 mb-2">Verification</h4>
                <p className="text-blue-700 text-sm">We'll verify your school details and UDISE information</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3">2</div>
                <h4 className="font-semibold text-blue-900 mb-2">Contact</h4>
                <p className="text-blue-700 text-sm">Our team will reach out to discuss subscription plans</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-3">3</div>
                <h4 className="font-semibold text-blue-900 mb-2">Activation</h4>
                <p className="text-blue-700 text-sm">Your school dashboard will be activated once approved</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/">
              <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <Home className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
            </Link>
            
            <Link href="/school/dashboard">
              <Button 
                variant="outline"
                className="border-2 border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-vidwanic-orange mr-2" />
              <h3 className="text-lg font-semibold text-vidwanic-text">Need Help?</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              If you have any questions about your application or need immediate assistance:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:hello@vidwanic.com"
                className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                hello@vidwanic.com
              </a>
              
              <a 
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600 italic">
              "We're excited to partner with your school in making learning more engaging and effective!"
            </p>
            <p className="text-sm text-vidwanic-orange font-semibold mt-2">- Team Vidwanic</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage;