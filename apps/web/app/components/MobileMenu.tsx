"use client";

import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import { handleSignOut } from '../lib/auth-actions';
import { Session } from 'next-auth';

interface MobileMenuProps {
  navigationItems: { name: string; href: string }[];
  session: Session | null;
}

const MobileMenu = ({ navigationItems, session }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm z-50 transition-transform duration-200 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="text-2xl font-bold text-vidwanic-orange" onClick={() => setIsOpen(false)}>
            VIDWANIC
          </Link>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <nav className="flex flex-col px-6 py-8 space-y-6">
            {navigationItems.map((item) => {
              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (item.href.startsWith('#')) {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
                setIsOpen(false);
              };
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-base hover:text-gray-900 ${
                    item.name === 'Subscribe for Schools' 
                      ? 'bg-vidwanic-orange text-white px-4 py-2 rounded-full font-semibold' 
                      : 'text-gray-700'
                  }`}
                  onClick={handleClick}
                >
                  {item.name}
                </a>
              );
            })}
            
            {/* Admin Link */}
            {session?.user?.isAdmin && (
              <Link
                href="/admin"
                className="text-base text-white bg-green-700 px-4 py-2 rounded-xl w-fit"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Section */}
          {session ? (
            <div className="border-t px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{session.user?.name}</p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>
              <form action={handleSignOut} className="mt-4">
                <Button 
                  type="submit"
                  variant="ghost"
                  className="text-sm text-red-600 hover:text-gray-900 px-0"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <div className="border-t px-6 py-4">
              <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="text-base text-gray-700 hover:text-gray-900 p-0"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;