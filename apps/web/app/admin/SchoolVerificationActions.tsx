"use client";

import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";

interface School {
  id: string;
  schoolName: string;
  city: string;
  state: string;
  isVerified: boolean;
  schoolType: string;
  udiseCode: string | null;
  onboardedByRole: string;
  createdAt: string;
  onboardedBy: { name: string; email: string };
}

interface SchoolVerificationActionsProps {
  school: School;
}

const SchoolVerificationActions = ({ school }: SchoolVerificationActionsProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState(school.isVerified);

  const handleVerification = async (approve: boolean) => {
    setIsVerifying(true);
    
    try {
      const response = await fetch('/api/admin/verify-school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolId: school.id,
          approve,
        }),
      });

      if (response.ok) {
        setStatus(approve);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert('Failed to update school verification status');
      }
    } catch (error) {
      console.error('Error updating school:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const schoolDashboardUrl = `/dashboard/${school.schoolName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

  return (
    <div className="p-3 bg-gray-50 rounded">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{school.schoolName}</p>
            <a 
              href={schoolDashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-vidwanic-orange hover:text-vidwanic-orange-hover"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-gray-500">{school.city}, {school.state}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status 
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
          {school.schoolType}
        </span>
        {school.udiseCode && (
          <span className="ml-2 text-xs text-gray-500">
            UDISE: {school.udiseCode}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600">By: {school.onboardedBy.name} ({school.onboardedByRole})</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(school.createdAt).toLocaleDateString()} at {new Date(school.createdAt).toLocaleTimeString()}
      </p>
      
      {!status && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => handleVerification(true)}
            disabled={isVerifying}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Check className="w-3 h-3" />
            {isVerifying ? 'Verifying...' : 'Approve'}
          </button>
          <button
            onClick={() => handleVerification(false)}
            disabled={isVerifying}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
          >
            <X className="w-3 h-3" />
            Reject
          </button>
          <a 
            href={`mailto:${school.onboardedBy.email}`}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-xs font-medium transition-colors"
          >
            Contact
          </a>
        </div>
      )}
    </div>
  );
};

export default SchoolVerificationActions;