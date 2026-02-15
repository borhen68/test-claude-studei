'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Package, Truck, CheckCircle, Clock, 
  Plus, Eye, Download, Share2, Calendar, MapPin
} from 'lucide-react';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState<'books' | 'orders'>('books');

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

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-700',
      processing: 'bg-amber-100 text-amber-700',
      shipped: 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700',
    };

    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
    };

    const Icon = icons[status];

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent"
            >
              Frametale
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New Book
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">Manage your photo books and orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('books')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'books' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Books ({books.length})
            {activeTab === 'books' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'orders' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Order History ({orders.length})
            {activeTab === 'orders' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
              />
            )}
          </button>
        </div>

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div>
            {books.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No books yet</h3>
                <p className="text-gray-600 mb-8">Create your first photo book to get started</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Book
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Cover Image */}
                    <div className="aspect-square bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                      {book.coverImageUrl ? (
                        <img 
                          src={book.coverImageUrl} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-20 h-20 text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                        {book.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>{book.pageCount || 0} pages</span>
                        <span>•</span>
                        <span>{formatDate(book.createdAt)}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-4">
                        {book.status === 'ready' && (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Ready to order
                          </span>
                        )}
                        {book.status === 'processing' && (
                          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                            Processing...
                          </span>
                        )}
                        {book.status === 'purchased' && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Purchased
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {book.status === 'ready' && (
                          <>
                            <Link
                              href={`/book/${book.id}`}
                              className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                            >
                              <Eye className="w-4 h-4" />
                              Preview
                            </Link>
                            <Link
                              href={`/checkout?bookId=${book.id}`}
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg hover:shadow-md transition text-sm font-semibold"
                            >
                              Order Now
                            </Link>
                          </>
                        )}
                        {book.status === 'processing' && (
                          <div className="flex-1 text-center py-2 text-sm text-gray-500">
                            Processing...
                          </div>
                        )}
                        {book.status === 'purchased' && (
                          <Link
                            href={`/book/${book.id}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            View Book
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-8">Your order history will appear here</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Book
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Book Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center overflow-hidden">
                          {order.book.coverImageUrl ? (
                            <img 
                              src={order.book.coverImageUrl} 
                              alt={order.book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-12 h-12 text-gray-300" />
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {order.book.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Size & Qty</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.config.size} × {order.config.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Est. Delivery</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(order.estimatedDelivery)}
                            </p>
                          </div>
                        </div>

                        {/* Tracking Info */}
                        {order.trackingNumber && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-900 mb-1 font-semibold">
                              Tracking Number
                            </p>
                            <p className="text-sm text-blue-700 font-mono">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            href={`/checkout/confirmation?orderId=${order.id}`}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                          {order.trackingNumber && (
                            <a
                              href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                            >
                              <Truck className="w-4 h-4" />
                              Track Package
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
