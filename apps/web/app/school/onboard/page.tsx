"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import { 
  School, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Globe, 
  Calendar,
  Users,
  GraduationCap,
  LogIn,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const SchoolOnboardingPage = () => {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    // Basic School Information
    schoolName: "",
    udiseCode: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    
    // Principal Information
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    
    // Onboarding User Information
    onboardedByName: "",
    onboardedByRole: "",
    onboardedByPhone: "",
    
    // School Details
    schoolType: "",
    boardAffiliation: "",
    establishedYear: "",
    totalStudents: "",
    totalTeachers: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      setSubmitMessage({ type: 'error', text: 'Please sign in to continue with school onboarding.' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      const response = await fetch('/api/school/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to success page
        window.location.href = `/school/onboard/success?schoolId=${data.schoolProfile.id}`;
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit onboarding request.' });
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/school/onboard' });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "School Information", icon: School },
    { number: 2, title: "Principal & Contact", icon: User },
    { number: 3, title: "Additional Details", icon: GraduationCap },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-vidwanic-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vidwanic-orange"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-vidwanic-background">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                VIDWANIC
              </Link>
              <Button onClick={handleSignIn} className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Auth Required Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <LogIn className="w-16 h-16 text-vidwanic-orange mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-vidwanic-text mb-4">
                School Onboarding
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Welcome to Vidwanic's school onboarding process! To ensure security and proper verification, 
                please sign in with your Google account to continue.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-vidwanic-text mb-1">Secure Process</h3>
                  <p className="text-sm text-gray-600">Your data is protected throughout the onboarding</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-vidwanic-text mb-1">UDISE Verification</h3>
                  <p className="text-sm text-gray-600">We verify schools through official UDISE database</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-vidwanic-text mb-1">Quick Approval</h3>
                  <p className="text-sm text-gray-600">Get verified within 2-3 business days</p>
                </div>
              </div>
              
              <Button 
                onClick={handleSignIn}
                className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-4 rounded-lg text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vidwanic-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
              VIDWANIC
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name?.split(' ')[0]}
              </span>
              <Link href="/" className="text-sm text-vidwanic-orange hover:text-vidwanic-orange-hover">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${ 
                  currentStep >= step.number 
                    ? 'bg-vidwanic-orange border-vidwanic-orange text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 mr-8">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-vidwanic-orange' : 'text-gray-400'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.number ? 'text-vidwanic-text' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mr-8 ${
                    currentStep > step.number ? 'bg-vidwanic-orange' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: School Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <School className="w-12 h-12 text-vidwanic-orange mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-vidwanic-text mb-2">School Information</h2>
                  <p className="text-gray-600">Please provide your school's basic information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      required
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="Enter your school name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UDISE Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="udiseCode"
                      value={formData.udiseCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="Enter UDISE code for verification"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      UDISE code helps us verify your school quickly
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="Enter complete school address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="PIN Code"
                      maxLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="https://yourschool.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white px-8 py-3"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Principal & Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="w-12 h-12 text-vidwanic-orange mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-vidwanic-text mb-2">Contact Information</h2>
                  <p className="text-gray-600">Principal details and your role in the school</p>
                </div>

                {/* Principal Information */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-vidwanic-text mb-4">Principal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Principal's Name *
                      </label>
                      <input
                        type="text"
                        name="principalName"
                        required
                        value={formData.principalName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder="Principal's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Principal's Email *
                      </label>
                      <input
                        type="email"
                        name="principalEmail"
                        required
                        value={formData.principalEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder="principal@school.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Principal's Phone *
                      </label>
                      <input
                        type="tel"
                        name="principalPhone"
                        required
                        value={formData.principalPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        required
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Contact Email *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        required
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder="contact@school.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Your Information */}
                <div className="bg-vidwanic-background/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-vidwanic-text mb-4">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="onboardedByName"
                        required
                        value={formData.onboardedByName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder={session.user.name || "Your full name"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Role in School *
                      </label>
                      <select
                        name="onboardedByRole"
                        required
                        value={formData.onboardedByRole}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      >
                        <option value="">Select your role</option>
                        <option value="Principal">Principal</option>
                        <option value="Vice Principal">Vice Principal</option>
                        <option value="Head Teacher">Head Teacher</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Administrator">Administrator</option>
                        <option value="IT Coordinator">IT Coordinator</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="onboardedByPhone"
                        required
                        value={formData.onboardedByPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white px-8 py-3"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white px-8 py-3"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <GraduationCap className="w-12 h-12 text-vidwanic-orange mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-vidwanic-text mb-2">School Details</h2>
                  <p className="text-gray-600">Additional information about your school</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Type *
                    </label>
                    <select
                      name="schoolType"
                      required
                      value={formData.schoolType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                    >
                      <option value="">Select school type</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Government Aided">Government Aided</option>
                      <option value="Central Government">Central Government</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board Affiliation
                    </label>
                    <select
                      name="boardAffiliation"
                      value={formData.boardAffiliation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                    >
                      <option value="">Select board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">IB</option>
                      <option value="Cambridge">Cambridge</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established Year
                    </label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="e.g., 1995"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Students (Approximate)
                    </label>
                    <input
                      type="number"
                      name="totalStudents"
                      value={formData.totalStudents}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="e.g., 500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Teachers (Approximate)
                    </label>
                    <input
                      type="number"
                      name="totalTeachers"
                      value={formData.totalTeachers}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange"
                      placeholder="e.g., 30"
                      min="1"
                    />
                  </div>
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg ${
                    submitMessage.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      {submitMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      {submitMessage.text}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white px-8 py-3"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white px-8 py-3 font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboardingPage;