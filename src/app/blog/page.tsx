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
