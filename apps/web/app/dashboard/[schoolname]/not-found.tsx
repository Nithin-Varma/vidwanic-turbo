import Link from "next/link";
import { School, ArrowLeft, Home } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export default function SchoolNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <School className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            School Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            The school you're looking for doesn't exist or may have been removed from our system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin">
              <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            
            <Link href="/">
              <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}