'use client';

import { use, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function BookPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [resolvedParams.id]);

  async function fetchBook() {
    try {
      // TODO: Fetch book and pages from API
      // For now, mock data
      setBook({
        id: resolvedParams.id,
        title: 'Your Photos',
        pageCount: 24,
      });
      setPages(Array(24).fill(null).map((_, i) => ({
        pageNumber: i + 1,
        template: 'hero',
      })));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch book:', error);
    }
  }

  function nextPage() {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{book?.title}</h1>
            <p className="text-gray-600">{book?.pageCount} pages</p>
          </div>
          <Link
            href={`/checkout?bookId=${resolvedParams.id}`}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Buy for $39
          </Link>
        </div>

        {/* Book Viewer */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-300 mb-4">
                  {currentPage + 1}
                </div>
                <div className="text-gray-500">Page preview</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-3 rounded-full border-2 border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-rose-500 hover:bg-rose-50 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                Page {currentPage + 1} of {pages.length}
              </div>
              <div className="flex gap-1">
                {pages.slice(0, 10).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition ${
                      i === currentPage ? 'bg-rose-500 w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              className="p-3 rounded-full border-2 border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-rose-500 hover:bg-rose-50 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <Link
            href={`/checkout?bookId=${resolvedParams.id}`}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-12 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl"
          >
            I Love It - Buy Now for $39
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Free shipping • Arrives in 5-7 days • 100% satisfaction guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
