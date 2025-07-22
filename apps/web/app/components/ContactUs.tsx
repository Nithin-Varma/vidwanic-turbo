"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Users, BookOpen, LogIn } from "lucide-react";

const ContactUs = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    message: "",
    contactType: "school"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      setSubmitMessage({ type: 'error', text: 'Please sign in to submit an enquiry.' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      const response = await fetch('/api/enquires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Thank you for your enquiry! We\'ll get back to you soon.' });
        // Reset form
        setFormData({
          name: "",
          organization: "",
          message: "",
          contactType: "school"
        });
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit enquiry. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href + '#contact-form' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@vidwanic.com",
      description: "Send us your questions anytime",
      color: "text-blue-600",
      link: "mailto:hello@vidwanic.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 98765 43210",
      description: "Mon-Fri, 9:00 AM - 6:00 PM",
      color: "text-green-600",
      link: "https://wa.me/919876543210"
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
    <section className="w-full bg-gray-50 py-20 md:py-24 lg:py-32">
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
                    {info.link ? (
                      <a 
                        href={info.link} 
                        className="text-vidwanic-text font-medium mb-1 hover:text-vidwanic-orange transition-colors duration-200 cursor-pointer block"
                        target={info.link.startsWith('https://wa.me') ? '_blank' : '_self'}
                        rel={info.link.startsWith('https://wa.me') ? 'noopener noreferrer' : ''}
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-vidwanic-text font-medium mb-1">{info.content}</p>
                    )}
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
            <div id="contact-form" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
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

                {/* Authentication Check */}
                {!session?.user ? (
                  <div className="text-center py-8">
                    <div className="bg-vidwanic-orange/10 rounded-xl p-8">
                      <LogIn className="w-12 h-12 text-vidwanic-orange mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-vidwanic-text mb-2">
                        Sign In Required
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Please sign in to submit an enquiry. We'll use your account information to process your request.
                      </p>
                      <Button
                        onClick={handleSignIn}
                        className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-3 rounded-lg"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In with Google
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* User Info Display */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-3">
                        {session.user.image && (
                          <img 
                            src={session.user.image} 
                            alt={session.user.name || ''} 
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium text-green-800">
                            Signed in as: {session.user.name || 'User'}
                          </p>
                          <p className="text-sm text-green-600">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
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
                          placeholder={session.user.name || "Your full name"}
                        />
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

                      {/* Submit Message */}
                      {submitMessage && (
                        <div className={`p-4 rounded-lg ${
                          submitMessage.type === 'success' 
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                          {submitMessage.text}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting || !session?.user}
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
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
)};

export default ContactUs;