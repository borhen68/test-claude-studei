'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, upload photos, or place an order. This includes your name, email address, shipping address, and payment information.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process your orders, send you updates, and respond to your requests.',
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time. You can manage your preferences in your account settings.',
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

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-600">Last updated: February 15, 2026</p>
        </motion.div>

        <div className="glass rounded-3xl p-8 md:p-12 space-y-8">
          <p className="text-lg text-neutral-700 leading-relaxed">
            At Frametale, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>

          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">{section.title}</h2>
              <p className="text-neutral-700 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}

          <div className="pt-8 border-t border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Contact Us</h2>
            <p className="text-neutral-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@frametale.com" className="text-violet-600 hover:text-violet-700 font-medium">
                privacy@frametale.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
