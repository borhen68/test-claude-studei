'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, BookOpen, Package, Settings, CreditCard, LogOut, Menu, X
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Books', href: '/dashboard/books', icon: BookOpen },
    { name: 'Orders', href: '/dashboard/orders', icon: Package },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Frametale
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative"
                    >
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-violet-700'
                          : 'text-neutral-700 hover:text-violet-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              {/* User menu - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-neutral-900">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {user?.email}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-neutral-700" />
                ) : (
                  <Menu className="w-6 h-6 text-neutral-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200/50 bg-white/80 backdrop-blur-lg"
          >
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
