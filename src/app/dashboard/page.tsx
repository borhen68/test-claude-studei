'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, ShoppingCart, Download, Plus, Loader2, Package, Truck, CheckCircle } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  status: string;
  pageCount: number;
  createdAt: string;
  coverImageUrl?: string;
}

interface Order {
  id: string;
  bookId: string;
  status: string;
  total: number;
  createdAt: string;
  trackingNumber?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'books' | 'orders'>('books');

  useEffect(() => {
    // Get email from localStorage or prompt
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      loadData(storedEmail);
    } else {
      const userEmail = prompt('Enter your email to view your books and orders:');
      if (userEmail) {
        localStorage.setItem('userEmail', userEmail);
        setEmail(userEmail);
        loadData(userEmail);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const loadData = async (userEmail: string) => {
    setLoading(true);
    
    try {
      // Load orders first to get book IDs
      const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
      const ordersData = await ordersRes.json();
      
      if (ordersData.success) {
        setOrders(ordersData.orders);
        
        // Load books from orders
        const bookIds = ordersData.orders.map((o: Order) => o.bookId);
        const booksData = await Promise.all(
          bookIds.map(id => fetch(`/api/books?id=${id}`).then(r => r.json()))
        );
        
        const loadedBooks = booksData
          .filter(d => d.success)
          .map(d => d.book);
        
        setBooks(loadedBooks);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      uploading: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      ready: 'bg-green-100 text-green-700',
      ordered: 'bg-purple-100 text-purple-700',
      paid: 'bg-green-100 text-green-700',
      printing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'printing':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">{email}</p>
            </div>
            
            <button
              onClick={() => router.push('/upload')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Book
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'books'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Books ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {activeTab === 'books' && (
          <div>
            {books.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No books yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first photo book to get started
                </p>
                <button
                  onClick={() => router.push('/upload')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500"
                >
                  Create Your First Book
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200" />
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900">
                          {book.title}
                        </h3>
                        {getStatusBadge(book.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {book.pageCount || 0} pages • Created {formatDate(book.createdAt)}
                      </p>

                      <div className="flex gap-2">
                        {book.status === 'ready' && (
                          <>
                            <button
                              onClick={() => router.push(`/book/${book.id}`)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => router.push(`/checkout?bookId=${book.id}`)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Order
                            </button>
                          </>
                        )}
                        
                        {book.status === 'ordered' && (
                          <button
                            onClick={() => router.push(`/book/${book.id}`)}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Book
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600">
                  Your order history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const book = books.find(b => b.id === order.bookId);
                  
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getStatusIcon(order.status)}
                          </div>
                          
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">
                              {book?.title || 'Photo Book'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Order #{order.id.slice(0, 8)} • {formatDate(order.createdAt)}
                            </p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(order.total)}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-600 mt-1">
                              Tracking: {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/book/${order.bookId}`)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                        >
                          View Book
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
