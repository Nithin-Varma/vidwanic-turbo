import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. This area is restricted to administrators only.
        </p>
        <Link
          href="/"
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-vidwanic-orange hover:bg-vidwanic-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vidwanic-orange"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
} 