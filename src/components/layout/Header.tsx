'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (client-side)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user/profile');
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const navigation = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Frametale</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                <User className="h-4 w-4" />
                My Books
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              >
                Sign In
              </Link>
            )}
            
            <Link
              href="/upload"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all"
            >
              Create Your Book
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors py-2 ${
                    isActive(item.href)
                      ? 'text-orange-600'
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-100 pt-3 mt-2">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
                  >
                    <User className="h-4 w-4" />
                    My Books
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-600 hover:text-orange-600 transition-colors py-2 block"
                  >
                    Sign In
                  </Link>
                )}
                
                <Link
                  href="/upload"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all text-center block"
                >
                  Create Your Book
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
