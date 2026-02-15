'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BookOpen, Plus, Eye, Download, Share2, MoreVertical } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  status: string;
  coverImageUrl?: string;
  pageCount?: number;
  createdAt: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/books')
      .then((res) => res.json())
      .then((data) => setBooks(data.books || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              My Books
            </h1>
            <p className="text-neutral-600 mt-2">All your photo books in one place</p>
          </div>
          <Link href="/upload">
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-violet-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No books yet</h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Create your first photo book to preserve your memories in a beautiful, printed format
            </p>
            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Book
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                <Link href={`/book/${book.id}`} className="block">
                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-violet-400" />
                      </div>
                    )}
                    
                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        book.status === 'ready' 
                          ? 'bg-green-100/90 text-green-700' 
                          : book.status === 'processing'
                          ? 'bg-amber-100/90 text-amber-700'
                          : 'bg-blue-100/90 text-blue-700'
                      }`}>
                        {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                      </span>
                    </div>

                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="p-2 rounded-lg bg-white/90 hover:bg-white transition-colors">
                        <Download className="w-4 h-4 text-neutral-700" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/90 hover:bg-white transition-colors">
                        <Share2 className="w-4 h-4 text-neutral-700" />
                      </button>
                    </div>
                  </div>

                  {/* Book details */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-neutral-900 mb-2 truncate group-hover:text-violet-700 transition-colors">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                      {book.pageCount && <span>{book.pageCount} pages</span>}
                      {book.pageCount && <span>•</span>}
                      <span>{formatDate(book.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
