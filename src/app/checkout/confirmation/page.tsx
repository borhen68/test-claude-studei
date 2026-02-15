'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Check, Package, Truck, Mail, MapPin, Calendar, 
  Download, BookOpen, ArrowRight, Sparkles, Heart
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  total: number;
  config: {
    size: string;
    paperType: string;
    coverType: string;
    quantity: number;
  };
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  book: {
    title: string;
    coverImageUrl?: string;
  };
}

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.order);
        } else {
          router.push('/');
        }
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link 
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent"
          >
            Frametale
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-amber-500" />
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-2"
          >
            Thank you for your order, {order.shipping.name.split(' ')[0]}!
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500"
          >
            Order #{order.orderNumber}
          </motion.p>
        </motion.div>

        {/* Email Sent Notice */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 flex items-start gap-4"
        >
          <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">
              Confirmation email sent
            </p>
            <p className="text-sm text-blue-800">
              We've sent an order confirmation and receipt to <strong>{order.shipping.email}</strong>
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Timeline */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Processing & Printing</p>
                  <p className="text-sm text-gray-600">
                    Your book is being professionally printed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Shipped</p>
                  <p className="text-sm text-gray-600">
                    You'll get tracking info via email
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Book Preview */}
            {order.book.coverImageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-rose-100 p-4">
                <div className="aspect-square bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src={order.book.coverImageUrl} 
                    alt={order.book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center mt-3 font-semibold text-gray-900">
                  {order.book.title}
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Size:</span>
                <span className="font-semibold">{order.config.size}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Paper:</span>
                <span className="font-semibold">{order.config.paperType}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Cover:</span>
                <span className="font-semibold">{order.config.coverType}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Quantity:</span>
                <span className="font-semibold">{order.config.quantity}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Shipping Address */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
              <p className="text-gray-700">{order.shipping.name}</p>
              <p className="text-gray-700">{order.shipping.address}</p>
              <p className="text-gray-700">
                {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/dashboard"
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            View My Books
          </Link>
          
          <Link
            href="/"
            className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            Create Another Book
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Share Love */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-3 rounded-full">
            <Heart className="w-5 h-5 text-rose-500" />
            <p className="text-gray-700">
              Made with love • Frametale
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
