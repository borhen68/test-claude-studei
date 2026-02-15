'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Upload, Sparkles, Package, Clock, Heart, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockTestimonials } from '@/lib/data/mock-data';

export default function HomePage() {
  const router = useRouter();
  const featuredTestimonials = mockTestimonials.filter(t => t.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Turn Your Photos Into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Beautiful Books
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              AI-powered photo book creator that automatically organizes your memories
              into stunning layouts. No design skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/upload')}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Start Creating
              </button>
              
              <button
                onClick={() => router.push('/gallery')}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all border-2 border-gray-200 flex items-center justify-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                View Examples
              </button>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent h-32 bottom-0 z-10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Why Frametale?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-Powered Layouts
              </h3>
              <p className="text-gray-600">
                Our smart algorithm analyzes your photos and creates
                professional layouts automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Done in Minutes
              </h3>
              <p className="text-gray-600">
                Upload photos, review your book, and order. The whole
                process takes less than 10 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                High-quality printing on premium paper with professional
                binding that lasts for generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: Upload, title: 'Upload Photos', desc: 'Drag & drop your favorite images' },
              { step: '2', icon: Sparkles, title: 'AI Magic', desc: 'We create layouts automatically' },
              { step: '3', icon: Heart, title: 'Customize', desc: 'Review and personalize your book' },
              { step: '4', icon: Package, title: 'Receive', desc: 'Get it delivered in 7-10 days' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/how-it-works"
              className="text-blue-600 hover:text-blue-500 font-semibold"
            >
              Learn more about our process →
            </a>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-center text-gray-600 mb-12">
            See what our customers are saying
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100" />
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.productType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Preserve Your Memories?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Create your first photo book in minutes. No design experience needed.
          </p>
          <button
            onClick={() => router.push('/upload')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Started Free
          </button>
          <p className="text-blue-100 text-sm mt-4">
            ✓ No credit card required ✓ 100% satisfaction guarantee
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
