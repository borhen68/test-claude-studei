#!/bin/bash

# Gallery Page
cat > src/app/gallery/page.tsx << 'EOF'
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { galleryImages } from '@/lib/data/mock-data';

export const metadata = {
  title: 'Gallery - Frametale',
  description: 'Browse beautiful photo book examples and get inspired for your own creation.',
};

export default function GalleryPage() {
  const categories = ['All', 'Wedding', 'Travel', 'Family', 'Baby', 'Events'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get Inspired
          </h1>
          <p className="text-xl text-gray-600">
            Browse our collection of beautiful photo books created by customers like you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-6 py-2 rounded-lg font-medium transition-all hover:bg-blue-600 hover:text-white bg-gray-100 text-gray-700"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 overflow-hidden group-hover:scale-105 transition-transform shadow-lg" />
                <div className="px-2">
                  <div className="text-sm font-semibold text-blue-600 mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Create Yours?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload your photos and see your story come to life in minutes.
          </p>
          <a
            href="/upload"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all"
          >
            Start Creating
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
EOF

# Blog List Page
cat > src/app/blog/page.tsx << 'EOF'
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockBlogPosts } from '@/lib/data/mock-data';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

export const metadata = {
  title: 'Blog - Frametale',
  description: 'Tips, inspiration, and guides for creating beautiful photo books.',
};

export default function BlogPage() {
  const featuredPosts = mockBlogPosts.filter((p) => p.featured);
  const allPosts = mockBlogPosts;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Photo Book Inspiration & Tips
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to create stunning photo books with expert advice and creative ideas.
          </p>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 overflow-hidden group-hover:scale-105 transition-transform" />
                  <div className="text-sm font-semibold text-blue-600 mb-2">
                    {post.category}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readingTime} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 overflow-hidden group-hover:scale-105 transition-transform" />
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  {post.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
EOF

# Contact Page
cat > src/app/contact/page.tsx << 'EOF'
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We're here to help!
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a href="mailto:support@frametale.com" className="text-blue-600 hover:underline">
                        support@frametale.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <a href="tel:1-800-FRAMETALE" className="text-blue-600 hover:underline">
                        1-800-FRAMETALE
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Address</div>
                      <div className="text-gray-600">
                        123 Memory Lane<br />
                        San Francisco, CA 94102
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">Business Hours</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Monday - Friday: 9am - 6pm PST</div>
                  <div>Saturday: 10am - 4pm PST</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
EOF

echo "Batch 1 complete!"
