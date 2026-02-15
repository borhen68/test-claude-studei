import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pricing - Frametale',
  description: 'Simple, transparent pricing for beautiful photo books.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-700">
            Create your book for free. Only pay when you're ready to order.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* 8x8 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">8×8" Square</h3>
              <p className="text-gray-600 mb-6">Perfect for coffee tables</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$39.99</span>
                <span className="text-gray-600">/book</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['20-100 pages', 'Premium paper', 'Hardcover binding', 'Free shipping over $50'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/upload"
                className="block w-full text-center px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-full font-semibold hover:bg-orange-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* 10x10 - Popular */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-8 text-white transform scale-105 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">10×10" Square</h3>
              <p className="text-orange-100 mb-6">Large, statement piece</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$59.99</span>
                <span className="text-orange-100">/book</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['20-120 pages', 'Premium lustre paper', 'Hardcover binding', 'Free shipping'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/upload"
                className="block w-full text-center px-6 py-3 bg-white text-orange-600 rounded-full font-bold hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* 12x12 */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">12×12" Square</h3>
              <p className="text-gray-600 mb-6">Museum quality</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$79.99</span>
                <span className="text-gray-600">/book</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['20-150 pages', 'Premium lustre paper', 'Premium hardcover', 'Free shipping'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/upload"
                className="block w-full text-center px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-full font-semibold hover:bg-orange-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upgrade Options</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <h4 className="font-semibold text-gray-900 mb-1">Premium Paper</h4>
                <p className="text-gray-600 text-sm mb-2">Lustre finish, archival quality</p>
                <p className="font-bold text-orange-600">+$15</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📖</div>
                <h4 className="font-semibold text-gray-900 mb-1">Lay-Flat Binding</h4>
                <p className="text-gray-600 text-sm mb-2">Seamless panoramic spreads</p>
                <p className="font-bold text-orange-600">+$20</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">✨</div>
                <h4 className="font-semibold text-gray-900 mb-1">Gift Box</h4>
                <p className="text-gray-600 text-sm mb-2">Premium presentation box</p>
                <p className="font-bold text-orange-600">+$10</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {[
                {
                  q: 'Is there a subscription?',
                  a: 'No! Pay once per book. No hidden fees or subscriptions.',
                },
                {
                  q: 'How long does shipping take?',
                  a: '7-10 business days for standard shipping in the US. International shipping available.',
                },
                {
                  q: 'Can I order multiple copies?',
                  a: 'Yes! Get 10% off when you order 3+ copies of the same book.',
                },
                {
                  q: 'What if I\'m not satisfied?',
                  a: '100% satisfaction guarantee. If you\'re not happy, we\'ll reprint or refund.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Creating for Free
          </h2>
          <p className="text-xl text-orange-50 mb-8">
            Only pay when you're ready to order your book
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
