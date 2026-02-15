'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, FileText, Mail, 
  MessageSquare, Settings, LogOut 
} from 'lucide-react';

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Content', href: '/admin/content', icon: Package },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Frametale</p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="block relative">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <button className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-300 hover:bg-white/5 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
