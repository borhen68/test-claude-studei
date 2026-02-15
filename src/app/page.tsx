'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, Mail, Sparkles, Heart, Check } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
            Frametale
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#products" className="hover:text-gray-900 transition">Products</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition">How it works</a>
            <a href="#examples" className="hover:text-gray-900 transition">Examples</a>
            <Link 
              href="/upload" 
              className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Large, Photo-Focused */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div {...fadeInUp}>
              <div className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-6">
                ✨ Turn memories into keepsakes
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Your photos,
                <br />
                <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  beautifully told
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                We transform your everyday photos into stunning photo books, calendars, and cards. 
                Upload, preview, love it—all in under 3 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/upload"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Create your book
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-300 transition">
                  See examples
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>100% satisfaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Ships in 5-7 days</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero Image/Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Placeholder for book preview */}
                <div className="aspect-square bg-gradient-to-br from-amber-100 via-rose-100 to-purple-100 flex items-center justify-center">
                  <BookOpen className="w-32 h-32 text-amber-600 opacity-20" />
                </div>
              </div>
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-rose-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">10,000+</div>
                    <div className="text-xs text-gray-500">Happy customers</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section - Clean Cards */}
      <section id="products" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Choose your canvas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every memory deserves the perfect format. We make it easy to choose.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Photo Books',
                description: 'Your story, page by page. From vacations to everyday moments.',
                price: '$39',
                features: ['20-60 pages', 'Hardcover', 'Premium paper'],
                gradient: 'from-amber-400 to-orange-500',
                bgGradient: 'from-amber-50 to-orange-50'
              },
              {
                icon: Calendar,
                title: 'Calendars',
                description: 'Relive your best 12 months, one photo at a time.',
                price: '$29',
                features: ['12 photos', 'Wall or desk', 'Monthly themes'],
                gradient: 'from-blue-400 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50'
              },
              {
                icon: Mail,
                title: 'Cards',
                description: 'Personalized greetings that leave a lasting impression.',
                price: '$19',
                features: ['Packs of 10', 'Custom text', 'Multiple designs'],
                gradient: 'from-purple-400 to-pink-500',
                bgGradient: 'from-purple-50 to-pink-50'
              }
            ].map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.bgGradient} rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${product.gradient} mb-6`}>
                    <product.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                    <span className="text-gray-500">per item</span>
                  </div>
                  <Link
                    href="/upload"
                    className="block text-center w-full py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                  >
                    Get started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Visual Steps */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Simple as 1, 2, 3
            </h2>
            <p className="text-xl text-gray-600">
              No design skills required. We handle the magic.
            </p>
          </motion.div>

          <div className="space-y-20">
            {[
              {
                step: '01',
                title: 'Upload your photos',
                description: 'Drag and drop any photos—from your phone, computer, or cloud. We\'ll handle the rest.',
                time: '30 seconds'
              },
              {
                step: '02',
                title: 'We create the magic',
                description: 'Our AI analyzes faces, moments, and colors. We pick the best layouts and add beautiful captions.',
                time: '1 minute'
              },
              {
                step: '03',
                title: 'Preview & order',
                description: 'Flip through your book page by page. Love it? One click to order. Ships in 5-7 days.',
                time: '1 minute'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="text-6xl font-bold text-amber-200 mb-4">{step.step}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    {step.time}
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Start preserving your memories today
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join 10,000+ people who've turned their photos into unforgettable keepsakes.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-3 bg-white text-rose-600 px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl"
            >
              Create your first book
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent mb-4">
            Frametale
          </div>
          <p className="text-sm">© 2026 Frametale. Made with ❤️ for your memories.</p>
        </div>
      </footer>
    </div>
  );
}
