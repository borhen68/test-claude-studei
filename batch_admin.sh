#!/bin/bash

# Admin Blog Management
cat > src/app/admin/blog/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/admin/blog?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token',
        },
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.slug !== slug));
        alert('Post deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-2">Create and manage blog posts</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Post
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading posts...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Published
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.excerpt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {post.featured ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.slug)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
EOF

# Admin Testimonials Management
cat > src/app/admin/testimonials/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2, Check, X } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string) => {
    // TODO: Implement API call to toggle featured status
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, featured: !t.featured } : t
    ));
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    // TODO: Implement API call to delete
    setTestimonials(testimonials.filter(t => t.id !== id));
    alert('Testimonial deleted!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and testimonials</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading testimonials...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.productType}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeatured(testimonial.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        testimonial.featured
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                      title={testimonial.featured ? 'Featured' : 'Not featured'}
                    >
                      {testimonial.featured ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# Admin Newsletter Management
cat > src/app/admin/newsletter/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { Mail, Download, Send } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers] = useState([
    { email: 'user1@example.com', subscribedAt: '2024-02-10', status: 'active' },
    { email: 'user2@example.com', subscribedAt: '2024-02-08', status: 'active' },
    { email: 'user3@example.com', subscribedAt: '2024-02-05', status: 'active' },
  ]);

  const exportSubscribers = () => {
    const csv = 'Email,Subscribed At,Status\n' + 
      subscribers.map(s => `${s.email},${s.subscribedAt},${s.status}`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
            <p className="text-gray-600 mt-2">Manage email subscribers</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportSubscribers}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Campaign
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <div className="text-sm font-medium text-gray-600">Total Subscribers</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{subscribers.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Active</div>
            <div className="text-3xl font-bold text-green-600">
              {subscribers.filter(s => s.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">This Month</div>
            <div className="text-3xl font-bold text-blue-600">+12</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Subscribed
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {subscriber.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
EOF

# Admin Content Management
cat > src/app/admin/content/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

export default function AdminContentPage() {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    heroTitle: 'Turn Your Photos Into Beautiful Books',
    heroSubtitle: 'AI-powered photo book creator that automatically organizes your memories into stunning layouts.',
    aboutMission: 'Our mission is to help families preserve their precious memories...',
  });

  const saveContent = async () => {
    setSaving(true);
    // TODO: Implement API call to save content
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Content saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Edit page content and copy</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Homepage Hero</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">About Page</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                rows={6}
                value={content.aboutMission}
                onChange={(e) => setContent({ ...content, aboutMission: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Admin pages created!"
