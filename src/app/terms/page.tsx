'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using Frametale, you accept and agree to be bound by the terms and provision of this agreement.',
    },
    {
      title: 'Use License',
      content: 'Permission is granted to temporarily download one copy of the materials on Frametale for personal, non-commercial transitory viewing only.',
    },
    {
      title: 'User Content',
      content: 'You retain all rights to the photos and content you upload. By uploading content, you grant us a license to use it solely for providing our services.',
    },
    {
      title: 'Order and Payment',
      content: 'All orders are subject to acceptance and availability. Payment must be received before order processing begins.',
    },
    {
      title: 'Refunds and Returns',
      content: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with your photo book, contact us for a refund or reprint.',
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
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-neutral-600">Last updated: February 15, 2026</p>
        </motion.div>

        <div className="glass rounded-3xl p-8 md:p-12 space-y-8">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Welcome to Frametale. These Terms of Service govern your use of our website and services. Please read them carefully.
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
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Questions?</h2>
            <p className="text-neutral-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@frametale.com" className="text-violet-600 hover:text-violet-700 font-medium">
                legal@frametale.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
