import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { User, Menu } from "lucide-react";
import Link from "next/link";
import { auth } from "../../auth";
import { handleSignOut } from "../lib/auth-actions";
import MobileMenu from "./MobileMenu";

const Header = async () => {
  const session = await auth();
  const navigationItems = [
    { name: "Publications", href: "/publications" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Primary Nav */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                VIDWANIC
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Admin Link */}
            {session?.user?.isAdmin && (
              <Link 
                href="/admin"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <span className="text-sm text-white bg-green-700 px-4 py-2 rounded-xl">Admin</span>
              </Link>
            )}

            {/* User Menu */}
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-700">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <form action={handleSignOut}>
                  <Button 
                    type="submit"
                    variant="ghost" 
                    className="text-sm text-red-600 hover:text-gray-900"
                  >
                    Sign Out
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button 
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <MobileMenu navigationItems={navigationItems} session={session} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;