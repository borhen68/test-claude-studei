import Link from 'next/link';
import { ArrowRight, Upload, Sparkles, Package } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Turn Your Photos Into a Beautiful Book
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              in Less Than 3 Minutes
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/upload"
                className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
              >
                Upload Your Photos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Example Books */}
            <div className="mt-16 grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Upload className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  1. Upload Photos
                </h3>
                <p className="mt-2 text-gray-600">
                  Drag & drop 20-200 photos
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Sparkles className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  2. We Design It
                </h3>
                <p className="mt-2 text-gray-600">
                  Smart layout, professional design
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Package className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  3. Receive Your Book
                </h3>
                <p className="mt-2 text-gray-600">
                  Ships in 5-7 days, $39 total
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              One Book, One Price
            </h2>
            <div className="mt-10">
              <div className="text-6xl font-bold text-gray-900">$39</div>
              <ul className="mt-8 space-y-3 text-left">
                <li className="flex gap-3">
                  <span className="text-blue-600">✓</span>
                  <span>8x8" hardcover, 20-60 pages</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600">✓</span>
                  <span>Premium paper, lay-flat binding</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600">✓</span>
                  <span>Ships in 5-7 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600">✓</span>
                  <span>No hidden fees, no upsells</span>
                </li>
              </ul>
              <div className="mt-10">
                <Link
                  href="/upload"
                  className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Start Your Book
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 Frametale. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
