"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@repo/ui/components/ui/sheet";
import { Search, Menu, User } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Magazines", href: "/magazines" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-vidwanic-background border-b border-gray-200/60 backdrop-blur supports-[backdrop-filter]:bg-vidwanic-background/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-6">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-vidwanic-text">
            VIDWANIC
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-vidwanic-text hover:text-vidwanic-orange transition-colors duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search magazines..."
              className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-vidwanic-orange focus:ring-vidwanic-orange"
            />
          </div>

          {/* Login */}
          <Button variant="ghost" className="text-vidwanic-text hover:text-vidwanic-orange">
            <User className="h-4 w-4 mr-2" />
            Login
          </Button>

          {/* Subscribe Button */}
          <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
            Subscribe Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
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
                  placeholder="Search magazines..."
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-vidwanic-orange focus:ring-vidwanic-orange"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-vidwanic-text hover:text-vidwanic-orange transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3 pt-4 border-t">
                <Button variant="ghost" className="text-vidwanic-text hover:text-vidwanic-orange justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;