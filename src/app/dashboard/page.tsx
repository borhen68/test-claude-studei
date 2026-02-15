'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Package, Truck, CheckCircle, Clock, 
  Plus, Eye, Download, Share2, TrendingUp, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';

interface Book {
  id: string;
  title: string;
  coverImageUrl?: string;
  status: 'uploading' | 'processing' | 'ready' | 'purchased';
  pageCount: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  book: {
    title: string;
    coverImageUrl?: string;
  };
  config: {
    size: string;
    quantity: number;
  };
}

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's books and orders
    Promise.all([
      fetch('/api/books').then(res => res.json()),
      fetch('/api/orders').then(res => res.json()),
    ])
      .then(([booksData, ordersData]) => {
        if (booksData.success) setBooks(booksData.books);
        if (ordersData.success) setOrders(ordersData.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const stats = [
    {
      label: 'Total Books',
      value: books.length,
      icon: BookOpen,
      color: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
    },
    {
      label: 'Orders',
      value: orders.length,
      icon: Package,
      color: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
    },
    {
      label: 'In Progress',
      value: orders.filter(o => o.status === 'processing' || o.status === 'pending').length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
    },
    {
      label: 'Delivered',
      value: orders.filter(o => o.status === 'delivered').length,
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-neutral-600 mt-2">Here's what's happening with your books</p>
          </div>
          <Link
            href="/upload"
            className="group relative"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Book
            </motion.button>
          </Link>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Bento Grid Layout - Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Books - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Recent Books</h2>
              <Link href="/dashboard/books" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
                View all
              </Link>
            </div>
            
            {books.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No books yet</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create your first book
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {books.slice(0, 3).map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
                  >
                    <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-8 h-8 text-violet-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 truncate">{book.title}</h3>
                      <p className="text-sm text-neutral-500">
                        {book.pageCount ? `${book.pageCount} pages` : 'Processing...'} • {formatDate(book.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/book/${book.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 hover:from-violet-100 hover:to-indigo-100 font-medium transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions - 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/upload"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white/80">
                  <Plus className="w-5 h-5 text-violet-600" />
                </div>
                <span className="font-medium text-neutral-900 group-hover:text-violet-700 transition-colors">
                  Create New Book
                </span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white/80">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-medium text-neutral-900 group-hover:text-indigo-700 transition-colors">
                  Track Orders
                </span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white/80">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-medium text-neutral-900 group-hover:text-amber-700 transition-colors">
                  Settings
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Order</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Book</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-neutral-100 hover:bg-white/50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-neutral-900">{order.orderNumber}</td>
                      <td className="py-4 px-4 text-sm text-neutral-700">{order.book.title}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status === 'delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                          {order.status === 'shipped' && <Truck className="w-3.5 h-3.5" />}
                          {order.status === 'processing' && <Package className="w-3.5 h-3.5" />}
                          {order.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-neutral-900">{formatPrice(order.total)}</td>
                      <td className="py-4 px-4 text-sm text-neutral-600">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
