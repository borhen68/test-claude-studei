'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Check, Sparkles, Clock, Shield, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { mockTestimonials } from '@/lib/data/mock-data';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const featuredTestimonials = mockTestimonials.filter(t => t.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-violet-50/30 to-amber-50/20">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold z-50">
        Skip to content
      </a>
      
      <Header />

      <main id="main-content">
        {/* Hero Section - Gradient Mesh + Floating Cards */}
        <section className="relative py-20 px-6 overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-40 w-96 h-96 bg-violet-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-40 -right-40 w-96 h-96 bg-amber-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            {/* Hero Text */}
            <motion.div 
              className="text-center mb-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-br from-violet-900 via-purple-800 to-violet-700 bg-clip-text text-transparent leading-tight">
                Your Photos,<br />Beautifully Bound
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Transform your memories into premium photo books in minutes. Intelligent layout engine handles the design—you just upload and enjoy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={() => router.push('/upload')}
                  className="group relative px-8 py-4 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 inline-flex items-center gap-3"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Your Book
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => router.push('/how-it-works')}
                  className="px-8 py-4 bg-white/80 backdrop-blur-md border-2 border-neutral-200 text-neutral-900 rounded-3xl font-semibold text-lg shadow-md hover:shadow-lg hover:bg-white transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  See How It Works
                </motion.button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-neutral-600">
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" /> No account needed
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" /> Done in 10 minutes
                </span>
              </div>
            </motion.div>

            {/* Bento Grid - Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
              {/* Photo Books - Large Feature */}
              <motion.div
                onClick={() => router.push('/upload')}
                className="md:col-span-7 md:row-span-2 group relative overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-10 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="relative z-10 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                      <Sparkles className="h-4 w-4" />
                      Most Popular
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-3">Photo Books</h3>
                    <p className="text-2xl text-violet-100 mb-4">from $39</p>
                    <p className="text-lg text-violet-50 leading-relaxed max-w-md">
                      Premium hardcover books with professional-grade printing. Perfect for weddings, travel, and family memories.
                    </p>
                  </div>
                  <div className="mt-8">
                    <div className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-full font-semibold hover:bg-violet-50 transition-colors group-hover:scale-105 transition-transform">
                      Create Now
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </motion.div>

              {/* Calendars */}
              <motion.div
                onClick={() => router.push('/upload')}
                className="md:col-span-5 group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col justify-between min-h-[280px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="relative z-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">Photo Calendars</h3>
                  <p className="text-xl text-blue-100 mb-3">from $29</p>
                  <p className="text-blue-50 text-sm leading-relaxed">
                    12 months of your favorite memories. Perfect for gifting or keeping track of special dates.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-white font-semibold text-sm mt-6 group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              </motion.div>

              {/* Greeting Cards */}
              <motion.div
                onClick={() => router.push('/upload')}
                className="md:col-span-5 group relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col justify-between min-h-[280px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="relative z-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">Greeting Cards</h3>
                  <p className="text-xl text-pink-100 mb-3">from $19</p>
                  <p className="text-pink-50 text-sm leading-relaxed">
                    Custom cards for birthdays, holidays, or just because. Personal touches that matter.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-white font-semibold text-sm mt-6 group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Removed ALL AI language */}
        <section className="py-24 px-6 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                The Photo Book You'll<br />Actually Finish
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                No design skills needed. Our intelligent layout engine arranges everything beautifully while you focus on the memories.
              </p>
            </motion.div>

            {/* Feature Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: 'Done in Minutes',
                  description: 'Upload your photos and our automatic layout system creates a beautiful book in seconds. No manual dragging or complex design work.',
                  color: 'from-violet-500 to-purple-600',
                },
                {
                  icon: Sparkles,
                  title: 'Smart Quality Checks',
                  description: 'Advanced analysis detects low-resolution or blurry images before printing, ensuring every page looks perfect.',
                  color: 'from-amber-500 to-orange-600',
                },
                {
                  icon: Globe,
                  title: 'Create Anywhere',
                  description: 'Start on your phone during commute, finish on your laptop at home. Seamless sync across all devices.',
                  color: 'from-blue-500 to-cyan-600',
                },
                {
                  icon: Star,
                  title: 'Professional Layouts',
                  description: 'Automatic color extraction and expert-designed templates ensure magazine-quality results every time.',
                  color: 'from-pink-500 to-rose-600',
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your photos are encrypted and secure. We never share or use them for anything beyond creating your book.',
                  color: 'from-green-500 to-emerald-600',
                },
                {
                  icon: Check,
                  title: '100% Satisfaction',
                  description: 'Love your book or get your money back. Premium quality guaranteed, no questions asked.',
                  color: 'from-indigo-500 to-violet-600',
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 px-6 bg-gradient-to-br from-violet-50 to-purple-50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Trusted by Over 10 Million Creators
              </motion.h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Join millions who've preserved their memories with stunning, professionally-crafted photo books.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-neutral-800 mb-6 leading-relaxed italic text-lg">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500" />
                    <div>
                      <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.productType}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 bg-gradient-to-br from-violet-600 via-purple-700 to-violet-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ready to Create Your<br />Photo Book?
              </h2>
              <p className="text-xl text-violet-100 mb-10 leading-relaxed">
                Join over 10 million people who've turned their photos into beautiful books.<br />
                No design skills needed. No account required to start.
              </p>
              <motion.button
                onClick={() => router.push('/upload')}
                className="group px-12 py-6 bg-white text-violet-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/20 transition-all inline-flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Creating Free
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <div className="mt-8 flex items-center justify-center gap-8 flex-wrap text-violet-100 text-sm">
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> No credit card
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> Cancel anytime
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" /> Money-back guarantee
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
