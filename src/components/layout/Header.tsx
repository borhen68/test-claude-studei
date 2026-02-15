'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Frametale</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/upload"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-500 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-500 transition-all text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
