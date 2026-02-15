import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Upload, Sparkles, Eye, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'How It Works - Frametale',
  description: 'Create beautiful photo books in minutes with our AI-powered platform.',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h1>
          <p className="text-xl text-gray-700">
            Create your perfect photo book in just 3 simple steps.
            No design skills required.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Upload Photos</h2>
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Drag and drop 20-200 of your favorite photos. We support JPG, PNG, and HEIC formats.
                  No account needed to get started!
                </p>
                <ul className="space-y-3">
                  {['Upload from your computer', 'Import from Google Photos', 'No file size limits', 'Your photos stay private'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl shadow-xl" />
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-xl" />
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">AI Magic</h2>
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our smart algorithm analyzes your photos and creates beautiful layouts automatically.
                  It groups photos by date, detects faces, and picks the perfect templates.
                </p>
                <ul className="space-y-3">
                  {['Automatic photo analysis', 'Smart chronological grouping', 'Perfect layout selection', 'Takes less than 30 seconds'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Review & Order</h2>
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Preview your book, make any edits you want, choose your size and finish,
                  then order. Ships to your door in 7-10 business days.
                </p>
                <ul className="space-y-3">
                  {['Edit photos or captions', 'Choose size and paper type', 'Guest checkout available', 'Free shipping over $50'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-orange-50 mb-8">
            Create your first photo book in minutes
          </p>
          <Link
            href="/upload"
            className="inline-block px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Create Your Book Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
