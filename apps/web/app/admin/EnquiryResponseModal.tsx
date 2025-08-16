"use client";

import { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  organization?: string;
  message: string;
  contactType: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface EnquiryResponseModalProps {
  enquiry: Enquiry;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EnquiryResponseModal({ enquiry, isOpen, onClose, onSuccess }: EnquiryResponseModalProps) {
  const [response, setResponse] = useState("");
  const [subject, setSubject] = useState(`Re: Your enquiry about ${enquiry.contactType}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/enquiries/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          response: response.trim(),
          subject: subject.trim()
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setResponse("");
        setSubject(`Re: Your enquiry about ${enquiry.contactType}`);
      } else {
        const error = await res.json();
        alert('Failed to send response: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-vidwanic-orange mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Respond to Enquiry</h2>
              <p className="text-sm text-gray-600">From: {enquiry.name} ({enquiry.user.email})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Original Enquiry */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Original Enquiry</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium text-gray-900">{enquiry.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-gray-900">{enquiry.user.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium text-gray-900">{enquiry.contactType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium text-gray-900">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                </div>
                {enquiry.organization && (
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Organization:</span>
                    <p className="font-medium text-gray-900">{enquiry.organization}</p>
                  </div>
                )}
              </div>
              <div>
                <span className="text-gray-500 text-sm">Message:</span>
                <div className="mt-2 p-3 bg-white rounded border">
                  <p className="text-gray-900 whitespace-pre-wrap">{enquiry.message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                placeholder="Email subject line"
              />
            </div>

            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                Your Response *
              </label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={8}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vidwanic-orange focus:border-vidwanic-orange"
                placeholder="Write your response to the customer..."
              />
              <p className="mt-1 text-sm text-gray-500">
                This response will be sent via email to {enquiry.user.email}
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vidwanic-orange"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !response.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-vidwanic-orange border border-transparent rounded-md hover:bg-vidwanic-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vidwanic-orange disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Response
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}