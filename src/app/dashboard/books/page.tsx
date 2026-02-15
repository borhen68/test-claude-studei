'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
            <p className="text-gray-600 mt-2">All your photo books in one place</p>
          </div>
          <Link href="/upload">
            <Button variant="primary">+ Create New Book</Button>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h3>
            <p className="text-gray-600 mb-6">Create your first photo book to get started</p>
            <Link href="/upload">
              <Button variant="primary">Create Your First Book</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-6xl">
                    📖
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg">{book.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="capitalize">{book.status}</span>
                    {book.pageCount && <span>• {book.pageCount} pages</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Created {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
