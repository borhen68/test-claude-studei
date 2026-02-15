'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [selectedSize, setSelectedSize] = useState<'8x8' | '10x10' | '12x12'>('10x10');

  const sizes = [
    { id: '8x8' as const, name: '8" × 8"', price: 2999, pages: 20 },
    { id: '10x10' as const, name: '10" × 10"', price: 3999, pages: 20, popular: true },
    { id: '12x12' as const, name: '12" × 12"', price: 4999, pages: 20 },
  ];

  const features = [
    'Premium hardcover binding',
    'Lay-flat pages for seamless spreads',
    'Museum-quality archival paper',
    'Professional photo printing',
    'Dust jacket included',
    'Lifetime warranty',
    'Free shipping over $50',
  ];

  const addons = [
    { name: 'Extra pages', price: 99, unit: 'per page' },
    { name: 'Gift box', price: 1499, unit: 'one-time' },
    { name: 'Leather cover upgrade', price: 2499, unit: 'one-time' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Header */}
      <header className="glass border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Frametale
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Choose the perfect size for your photo book. No hidden fees, no subscriptions.
          </motion.p>
        </div>

        {/* Size selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {sizes.map((size, index) => (
            <motion.button
              key={size.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedSize(size.id)}
              className="relative"
            >
              {size.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <div className={`glass rounded-2xl p-8 transition-all ${
                selectedSize === size.id
                  ? 'ring-2 ring-violet-500 shadow-xl'
                  : 'hover:shadow-lg'
              }`}>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">{size.name}</div>
                  <div className="text-sm text-neutral-600">{size.pages} pages</div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    ${(size.price / 100).toFixed(2)}
                  </div>
                </div>
                {selectedSize === size.id && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 pointer-events-none" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 md:p-12 mb-8"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">What's included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-neutral-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Optional add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-xl bg-white/50 border border-neutral-200 hover:border-violet-300 transition-colors"
              >
                <div className="font-semibold text-neutral-900 mb-2">{addon.name}</div>
                <div className="text-2xl font-bold text-violet-600 mb-1">
                  +${(addon.price / 100).toFixed(2)}
                </div>
                <div className="text-sm text-neutral-600">{addon.unit}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 h-14 px-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-semibold shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all"
            >
              Start Creating Your Book
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
