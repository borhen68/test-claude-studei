'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Upload, Sparkles, Package, Clock, Heart, Star, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockTestimonials } from '@/lib/data/mock-data';

export default function HomePage() {
  const router = useRouter();
  const featuredTestimonials = mockTestimonials.filter(t => t.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Journi Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Turn your photos into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mt-2">
                beautiful books
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-light">
              AI-powered photo book creator. Upload your photos and get a stunning book in minutes.
              <span className="block mt-2 text-gray-600">No design skills required.</span>
            </p>
            
            <button
              onClick={() => router.push('/upload')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all transform"
            >
              <Upload className="h-6 w-6" />
              Create Your Book
            </button>
            
            <p className="text-sm text-gray-500 mt-6">
              ✓ No account needed to start  ✓ 100% satisfaction guarantee
            </p>
          </div>

          {/* Hero Image Preview */}
          <div className="mt-16 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { gradient: 'from-orange-100 to-pink-100' },
                { gradient: 'from-pink-100 to-purple-100' },
                { gradient: 'from-amber-100 to-orange-100' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${item.gradient} shadow-2xl transform hover:scale-105 transition-transform`}
                  style={{ transform: `translateY(${i % 2 === 0 ? '0' : '20px'})` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Simple 3 Steps */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Three simple steps to preserve your memories
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { 
                step: '1', 
                icon: Upload, 
                title: 'Upload Photos', 
                desc: 'Drag and drop 20-200 of your favorite photos. No account needed.' 
              },
              { 
                step: '2', 
                icon: Sparkles, 
                title: 'AI Creates Your Book', 
                desc: 'Our smart algorithm organizes photos and designs beautiful layouts automatically.' 
              },
              { 
                step: '3', 
                icon: Package, 
                title: 'Receive & Enjoy', 
                desc: 'Review, customize if you want, and order. Delivered to your door in 7-10 days.' 
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features - Why Choose Us */}
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Frametale?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: '🎨',
                title: 'AI-Powered Layouts',
                desc: 'Smart algorithm analyzes your photos and creates professional layouts automatically.',
              },
              {
                icon: '⚡',
                title: 'Done in Minutes',
                desc: 'Upload photos, review your book, and order. The whole process takes less than 10 minutes.',
              },
              {
                icon: '📦',
                title: 'Premium Quality',
                desc: 'High-quality printing on premium paper with professional binding that lasts for generations.',
              },
              {
                icon: '💝',
                title: 'Perfect Gift',
                desc: 'Create meaningful gifts for birthdays, weddings, anniversaries, or just because.',
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                desc: 'Your photos are secure. We never share or use them for anything other than your book.',
              },
              {
                icon: '✨',
                title: 'No Design Skills',
                desc: 'Our AI does all the hard work. You just upload and enjoy the results.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            See what our customers are saying
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 shadow-md">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-pink-200" />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.productType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Preserve Your Memories?
          </h2>
          <p className="text-xl text-orange-50 mb-10 leading-relaxed">
            Create your first photo book in minutes. No design experience needed.<br />
            Start for free, no account required.
          </p>
          <button
            onClick={() => router.push('/upload')}
            className="px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Get Started Now
          </button>
          <p className="text-orange-50 text-sm mt-6 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" /> No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" /> 100% satisfaction guarantee
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
