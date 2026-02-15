import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockBlogPosts } from '@/lib/data/mock-data';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = mockBlogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <div className="mb-12">
            <div className="text-sm font-semibold text-blue-600 mb-4">
              {post.category}
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100" />
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-sm text-gray-500">{post.author.bio}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min read
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-12" />

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-4xl font-bold text-gray-900 mt-12 mb-6">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              } else if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              } else if (paragraph.startsWith('- ')) {
                return (
                  <li key={idx} className="text-gray-700 ml-6">
                    {paragraph.replace('- ', '')}
                  </li>
                );
              } else if (paragraph.trim()) {
                return (
                  <p key={idx} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Create Your Photo Book?
            </h3>
            <p className="text-gray-600 mb-6">
              Put these tips into practice and create a beautiful book today!
            </p>
            <a
              href="/upload"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all"
            >
              Get Started
            </a>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 group-hover:scale-105 transition-transform" />
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      {related.category}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{related.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
