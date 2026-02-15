'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      icon: Package,
      time: '7-10 business days',
      price: 'Free on orders over $50',
      color: 'from-violet-500 to-purple-500',
    },
    {
      name: 'Express Shipping',
      icon: Truck,
      time: '3-5 business days',
      price: '$14.99',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      name: 'Rush Shipping',
      icon: Clock,
      time: '1-2 business days',
      price: '$29.99',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <header className="glass border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Frametale
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
            <Truck className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-neutral-600">Fast, reliable delivery to your door</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {shippingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color.replace('500', '100')} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${option.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{option.name}</h3>
                <p className="text-neutral-600 mb-3">{option.time}</p>
                <p className="text-lg font-semibold text-violet-600">{option.price}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Shipping Details</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Production Time</h3>
              <p className="text-neutral-700">All photo books are printed on-demand. Production typically takes 3-5 business days before shipping.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tracking</h3>
              <p className="text-neutral-700">You'll receive a tracking number via email once your order ships. Track your package anytime in your dashboard.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">International Shipping</h3>
              <p className="text-neutral-700">We currently ship to the United States, Canada, and select European countries. International shipping times vary by destination.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
