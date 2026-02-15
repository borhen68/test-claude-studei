import Link from 'next/link';
import { ArrowRight, Heart, BookOpen, Calendar, Mail, Sparkles, Clock, Smile } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50">
      {/* Hero Section - Emotional */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <Heart className="h-16 w-16 text-rose-500 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Your Memories Deserve More Than a Phone Screen
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-600">
              Transform your precious photos into beautiful photo books, calendars, and cards. 
              <br />
              <span className="font-semibold text-rose-600">We do the design. You relive the moments.</span>
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="group rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-10 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                Create Your Memory Book
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#examples"
                className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold text-gray-700 hover:border-rose-500 hover:text-rose-600 transition-all"
              >
                See Examples
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 border-2 border-white" />
                  ))}
                </div>
                <span>10,000+ happy customers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★★★★★</span>
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              We Turn Photos Into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                Unforgettable Keepsakes
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Photo Books */}
            <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 hover:shadow-2xl transition-all hover:scale-105">
              <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <BookOpen className="h-12 w-12 text-rose-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Photo Books</h3>
              <p className="text-gray-600 mb-6">
                Your story, beautifully told. From vacations to baby's first year, we create stunning layouts that bring your memories to life.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  Auto-generated layouts
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  Smart captions
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  Premium hardcover
                </li>
              </ul>
              <div className="text-3xl font-bold text-gray-900">$39</div>
            </div>

            {/* Calendars */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 hover:shadow-2xl transition-all hover:scale-105">
              <Calendar className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Calendars</h3>
              <p className="text-gray-600 mb-6">
                Relive your best moments every month. We pick your best 12 photos and create a calendar you'll actually want to hang.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  12 best photos selected
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Wall or desk size
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Monthly themes
                </li>
              </ul>
              <div className="text-3xl font-bold text-gray-900">$29</div>
            </div>

            {/* Cards */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 hover:shadow-2xl transition-all hover:scale-105">
              <Mail className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Cards</h3>
              <p className="text-gray-600 mb-6">
                Personalized greetings that matter. From thank-you notes to holiday cards, make every message memorable.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Custom messages
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Multiple designs
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Packs of 10+
                </li>
              </ul>
              <div className="text-3xl font-bold text-gray-900">$19</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - The Magic */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Magic Happens in 3 Steps
            </h2>
            <p className="text-xl text-gray-600">
              No design skills needed. We handle everything.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  1
                </div>
                <Clock className="absolute -top-2 -right-2 h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Photos</h3>
              <p className="text-gray-600">
                Just drag & drop. No organizing needed. We'll sort through everything and find the gems.
              </p>
              <div className="mt-4 text-sm text-rose-600 font-semibold">~30 seconds</div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  2
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-purple-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">We Create Magic</h3>
              <p className="text-gray-600">
                Our AI analyzes faces, moments, and emotions. We pick the best layouts, add captions, and tell your story.
              </p>
              <div className="mt-4 text-sm text-purple-600 font-semibold">~1 minute of AI magic ✨</div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  3
                </div>
                <Smile className="absolute -top-2 -right-2 h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Preview & Love It</h3>
              <p className="text-gray-600">
                Flip through your book, calendar, or cards. Love it? Click buy. Want changes? Edit easily.
              </p>
              <div className="mt-4 text-sm text-blue-600 font-semibold">Arrives in 5-7 days 📦</div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Testimonials */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Stories From Happy Customers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I cried when I opened it. Seeing my baby's first year laid out so beautifully... Frametale captured moments I'd forgotten.",
                author: "Sarah M.",
                role: "New Mom",
                rating: 5
              },
              {
                quote: "Best gift I've ever given my parents. 50 years of memories in one stunning book. They look at it every day.",
                author: "Michael K.",
                role: "Anniversary Gift",
                rating: 5
              },
              {
                quote: "I'm not creative at all, but Frametale made me look like a professional designer. The calendar is gorgeous!",
                author: "Jessica L.",
                role: "Teacher",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 relative">
                <div className="text-yellow-500 text-2xl mb-4">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h2 className="text-5xl font-bold mb-6">
            Your Memories Are Waiting
          </h2>
          <p className="text-2xl mb-10 opacity-90">
            Don't let them stay trapped in your phone. Turn them into something you can hold, give, and treasure forever.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-3 bg-white text-rose-600 px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl"
          >
            Start Creating Now
            <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="mt-6 text-sm opacity-75">
            Join 10,000+ people who've turned their photos into unforgettable keepsakes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <Heart className="h-8 w-8 text-rose-500 mx-auto mb-4" />
            <p className="text-sm">© 2026 Frametale. Made with love for your memories.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
