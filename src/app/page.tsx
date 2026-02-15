'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockTestimonials } from '@/lib/data/mock-data';

export default function HomePage() {
  const router = useRouter();
  const featuredTestimonials = mockTestimonials.filter(t => t.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Journi-Style Product Cards */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Photo Book - Large Featured Card (Left, spans 2 rows) */}
            <div 
              onClick={() => router.push('/upload')}
              className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl row-span-2 flex flex-col justify-between min-h-[500px]"
            >
              {/* Placeholder for product image */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="w-64 h-64 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">Photo Books</h3>
                <p className="text-xl text-teal-100 mb-4">from $39</p>
                <div className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors">
                  Create Now
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            {/* Right Column - Calendars & Cards */}
            <div className="grid grid-rows-2 gap-6">
              {/* Photo Calendar */}
              <div 
                onClick={() => router.push('/upload')}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl flex flex-col justify-between min-h-[240px]"
              >
                <div className="flex-1 flex items-center justify-center mb-4">
                  <div className="w-32 h-32 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <span className="text-6xl">📅</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-1">Photo Calendars</h3>
                  <p className="text-lg text-blue-100 mb-3">from $29</p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold">
                    Create Now
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Greeting Cards */}
              <div 
                onClick={() => router.push('/upload')}
                className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-3xl p-8 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl flex flex-col justify-between min-h-[240px]"
              >
                <div className="flex-1 flex items-center justify-center mb-4">
                  <div className="w-32 h-32 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <span className="text-6xl">💌</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-1">Greeting Cards</h3>
                  <p className="text-lg text-pink-100 mb-3">from $19</p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold">
                    Create Now
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Types Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Choose Your Perfect Photo Book
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Hardcover */}
            <div className="text-center">
              <div className="aspect-[4/5] bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-6 shadow-lg flex items-center justify-center">
                <div className="text-8xl">📕</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hardcover Photo Books</h3>
              <p className="text-gray-600 leading-relaxed">
                Turn your memories into a sturdy, professional-grade heirloom that lasts for generations.
              </p>
            </div>
            
            {/* Softcover */}
            <div className="text-center">
              <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg flex items-center justify-center">
                <div className="text-8xl">📘</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Softcover Photo Books</h3>
              <p className="text-gray-600 leading-relaxed">
                Lightweight keepsake perfect for everyday memories and casual photo collections.
              </p>
            </div>
            
            {/* Layflat */}
            <div className="text-center">
              <div className="aspect-[4/5] bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6 shadow-lg flex items-center justify-center">
                <div className="text-8xl">📖</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Layflat Photo Books</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamless, hands-free viewing experience with panoramic spreads that lie completely flat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features - Journi Style */}
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
                The Photo Book<br />you'll actually finish
              </h2>
              
              <div className="space-y-8">
                {/* Done in seconds */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Done in seconds ⏱️
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our AI instantly arranges your photos into a beautiful timeline. No manual dragging, no design headaches.
                  </p>
                </div>
                
                {/* Create anywhere */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Create anytime, anywhere 📱
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Start on your phone during your commute, finish on your laptop at home. Works seamlessly across all devices.
                  </p>
                </div>
                
                {/* Smart quality checks */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Smart quality checks ✨
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    AI analyzes every photo and warns you about low resolution or blurry images before printing.
                  </p>
                </div>
                
                {/* Perfect layouts */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Perfect layouts, automatically 🎨
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Colors extracted from your photos. Professional layouts designed by experts. Zero effort required.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/upload')}
                className="mt-10 px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
              >
                Try It Free
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Right: Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-9xl">📚</div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">4.9/5</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">12,000+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by over 10 million memory-makers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI does the heavy lifting, so you can focus on what matters — preserving your memories and sharing your story.
            </p>
          </div>
          
          {/* Testimonials Grid */}
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

      {/* Why Choose Us - Feature Grid */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Frametale?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Done in Minutes',
                desc: 'Upload photos, AI creates your book, review & order. The entire process takes less than 10 minutes.',
              },
              {
                icon: '📦',
                title: 'Premium Quality',
                desc: 'Professional printing on premium paper. Binding that lasts for generations. Museum-quality results.',
              },
              {
                icon: '💝',
                title: 'Perfect Gift',
                desc: 'Birthdays, weddings, anniversaries, or just because. Create meaningful gifts that people actually keep.',
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                desc: 'Your photos are encrypted and secure. We never share or use them for anything other than your book.',
              },
              {
                icon: '✅',
                title: '100% Satisfaction',
                desc: 'Love your book or get your money back. No questions asked. That's our promise.',
              },
              {
                icon: '🌍',
                title: 'Global Shipping',
                desc: 'Fast, tracked delivery worldwide. From our print facility to your doorstep in 7-10 days.',
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

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Your Photo Book?
          </h2>
          <p className="text-xl text-teal-50 mb-10 leading-relaxed">
            Join over 10 million people who've turned their photos into beautiful books.<br />
            No design skills needed. No account required to start.
          </p>
          <button
            onClick={() => router.push('/upload')}
            className="px-12 py-6 bg-white text-teal-600 rounded-full font-bold text-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            Start Creating Free
            <ArrowRight className="h-6 w-6" />
          </button>
          <p className="text-teal-50 text-sm mt-6 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" /> No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" /> Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" /> 100% money-back guarantee
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
