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
