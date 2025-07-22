"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Users, BookOpen } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
    contactType: "school"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      organization: "",
      message: "",
      contactType: "school"
    });
    setIsSubmitting(false);
    
    // Show success message (you can implement proper success handling)
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@vidwanic.com",
      description: "Send us your questions anytime",
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 98765 43210",
      description: "Mon-Fri, 9:00 AM - 6:00 PM",
      color: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "New Delhi, India",
      description: "Schedule a meeting with our team",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We respond to all inquiries quickly",
      color: "text-orange-600"
    }
  ];

  const inquiryTypes = [
    {
      value: "school",
      label: "School Partnership",
      icon: Users,
      description: "Interested in subscribing for your school"
    },
    {
      value: "parent",
      label: "Individual Subscription",
      icon: BookOpen,
      description: "Personal subscription for your child"
    },
    {
      value: "content",
      label: "Content Partnership",
      icon: MessageSquare,
      description: "Collaborate on educational content"
    },
    {
      value: "general",
      label: "General Inquiry",
      icon: Mail,
      description: "Other questions or feedback"
    }
  ];

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-20 lg:py-24 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-vidwanic-peach/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-vidwanic-pink/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-6">
            Ready to Transform
            <span className="block text-vidwanic-orange">Learning Together?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a school looking to partner with us, a parent interested in our content, or someone with questions, 
            we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-vidwanic-text mb-4">Contact Information</h3>
              <p className="text-gray-600 mb-8">
                Choose the best way to reach us. We're here to help and answer any questions you might have.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${info.color} bg-current/10`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-vidwanic-text mb-1">{info.title}</h4>
                    <p className="text-vidwanic-text font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-vidwanic-text mb-4">Why Choose Vidwanic?</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold text-vidwanic-orange">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partner Schools</span>
                  <span className="font-semibold text-vidwanic-orange">500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Student Satisfaction</span>
                  <span className="font-semibold text-vidwanic-orange">95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-vidwanic-text mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.contactType === type.value
                            ? 'border-vidwanic-orange bg-vidwanic-orange/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactType"
                          value={type.value}
                          checked={formData.contactType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <type.icon className={`w-5 h-5 ${
                            formData.contactType === type.value ? 'text-vidwanic-orange' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-sm text-gray-600">{type.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange transition-colors duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    School/Organization Name
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange transition-colors duration-200"
                    placeholder="Your school or organization name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vidwanic-orange/20 focus:border-vidwanic-orange transition-colors duration-200 resize-vertical"
                    placeholder="Tell us about your requirements, questions, or how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-vidwanic-text mb-4">Frequently Asked Questions</h3>
          <p className="text-gray-600 mb-8">
            Can't find what you're looking for? Check out our FAQ section or reach out directly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-vidwanic-text mb-2">How do I subscribe for my school?</h4>
              <p className="text-sm text-gray-600">Contact us with your school details and student count. We'll provide a customized package.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-vidwanic-text mb-2">What age groups does Vidwanic serve?</h4>
              <p className="text-sm text-gray-600">Our content is designed for students aged 8-18, with different sections for different age groups.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-vidwanic-text mb-2">Can I get a sample issue?</h4>
              <p className="text-sm text-gray-600">Yes! Contact us to receive a free sample issue to evaluate our content quality.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;