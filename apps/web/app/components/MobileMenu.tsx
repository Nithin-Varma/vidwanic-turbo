"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@repo/ui/components/ui/sheet";
import { Search, Menu, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { handleSignIn, handleSignOut } from "../lib/auth-actions";

interface NavigationItem {
  name: string;
  href: string;
}

interface Session {
  user: {
    id: string;
    isAdmin: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface MobileMenuProps {
  navigationItems: NavigationItem[];
  session: Session | null;
}

const MobileMenu = ({ navigationItems, session }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left font-bold text-xl tracking-tight text-vidwanic-text">
            VIDWANIC
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search publications..."
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-vidwanic-orange focus:ring-vidwanic-orange"
            />
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-vidwanic-text hover:text-vidwanic-orange transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Authentication */}
          <div className="flex flex-col space-y-3 pt-4 border-t">
            {session?.user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 p-2">
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
                  <div>
                    <p className="text-sm font-medium text-vidwanic-text">
                      {session.user.name || session.user.email}
                    </p>
                    {session.user.isAdmin && (
                      <p className="text-xs text-vidwanic-orange">Admin</p>
                    )}
                  </div>
                </div>

                {/* Admin Access */}
                {session.user.isAdmin && (
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="text-vidwanic-text hover:text-vidwanic-orange justify-start w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                {/* Sign Out */}
                <form action={handleSignOut}>
                  <Button variant="ghost" type="submit" className="text-vidwanic-text hover:text-vidwanic-orange justify-start w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Sign In */}
                <form action={handleSignIn}>
                  <Button variant="ghost" type="submit" className="text-vidwanic-text hover:text-vidwanic-orange justify-start w-full">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </form>

                {/* Subscribe Button */}
                <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
                  Subscribe Now
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;