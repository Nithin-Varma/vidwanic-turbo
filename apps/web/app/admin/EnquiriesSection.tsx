"use client";

import { useState } from "react";
import { Clock, HelpCircle, MessageCircle, CheckCircle, Reply } from "lucide-react";
import EnquiryResponseModal from "./EnquiryResponseModal";

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

interface EnquiriesSectionProps {
  enquiries: Enquiry[];
  onEnquiryUpdated: () => void;
}

export default function EnquiriesSection({ enquiries, onEnquiryUpdated }: EnquiriesSectionProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRespond = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const handleResponseSuccess = () => {
    onEnquiryUpdated();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-3 h-3 mr-1 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-3 h-3 mr-1 text-blue-600" />;
      default:
        return <Clock className="w-3 h-3 mr-1 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Enquiries</h3>
          <div className="space-y-3">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{enquiry.name}</p>
                        <p className="text-sm text-gray-500">{enquiry.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                        {getStatusIcon(enquiry.status)}
                        {enquiry.status}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-vidwanic-orange/10 text-vidwanic-orange text-xs font-medium">
                        {enquiry.contactType}
                      </span>
                      {enquiry.organization && (
                        <span className="text-xs text-gray-500">
                          from {enquiry.organization}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {enquiry.status !== 'resolved' && (
                      <button
                        onClick={() => handleRespond(enquiry)}
                        className="inline-flex items-center px-3 py-1.5 bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white text-xs font-medium rounded-md transition-colors"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Respond
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{enquiry.message}</p>
                </div>
                
                {enquiry.status === 'resolved' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Responded and resolved
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {enquiries.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No enquiries yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {selectedEnquiry && (
        <EnquiryResponseModal
          enquiry={selectedEnquiry}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEnquiry(null);
          }}
          onSuccess={handleResponseSuccess}
        />
      )}
    </>
  );
}