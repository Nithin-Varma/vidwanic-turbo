import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Search, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { auth } from "../../auth";
import { handleSignIn, handleSignOut } from "../lib/auth-actions";
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
    <header className="sticky top-0 z-50 w-full bg-vidwanic-background border-b border-gray-200/60 backdrop-blur supports-[backdrop-filter]:bg-vidwanic-background/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-vidwanic-text">
            VIDWANIC
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-vidwanic-text hover:text-vidwanic-orange transition-colors duration-200 font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search publications..."
              className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-vidwanic-orange focus:ring-vidwanic-orange"
            />
          </div>

          {/* Authentication */}
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {/* Admin Access */}
              {session.user.isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" className="text-vidwanic-text hover:text-vidwanic-orange">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-vidwanic-orange rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-vidwanic-text">
                  {session.user.name || session.user.email}
                </span>
              </div>

              {/* Sign Out */}
              <form action={handleSignOut}>
                <Button variant="ghost" type="submit" className="text-vidwanic-text hover:text-vidwanic-orange">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Sign In */}
              <form action={handleSignIn}>
                <Button variant="ghost" type="submit" className="text-vidwanic-text hover:text-vidwanic-orange">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </form>

              {/* Subscribe Button */}
              <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
                Subscribe Now
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu navigationItems={navigationItems} session={session} />
      </div>
    </header>
  );
};

export default Header;