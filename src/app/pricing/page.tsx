import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check } from 'lucide-react';

export const metadata = {
  title: 'Pricing - Frametale',
  description: 'Affordable pricing for premium photo books, calendars, and cards.',
};

export default function PricingPage() {
  const products = [
    {
      name: 'Photo Book',
      subtitle: 'Classic',
      price: '$29',
      originalPrice: null,
      description: 'Perfect for everyday memories',
      features: [
        '20-100 pages',
        '8x8" or 8x10" sizes',
        'Premium matte paper',
        'Softcover or hardcover',
        'AI-powered layouts',
        'Free shipping over $50',
      ],
      cta: 'Create Book',
      href: '/upload?type=photobook',
      popular: false,
    },
    {
      name: 'Premium Book',
      subtitle: 'Best Seller',
      price: '$49',
      originalPrice: null,
      description: 'For your most special occasions',
      features: [
        '20-200 pages',
        'Multiple size options up to 12x12"',
        'Lustre or matte premium paper',
        'Lay-flat binding',
        'Custom cover options',
        'Free shipping',
        'Gift box included',
      ],
      cta: 'Create Premium Book',
      href: '/upload?type=premium',
      popular: true,
    },
    {
      name: 'Calendar',
      subtitle: '2025',
      price: '$24',
      originalPrice: '$29',
      description: 'Your photos, all year long',
      features: [
        '12 months of photos',
        '8.5x11" wall calendar',
        'High-quality paper',
        'Start any month',
        'Add personal dates',
        'Free shipping over $50',
      ],
      cta: 'Create Calendar',
      href: '/upload?type=calendar',
      popular: false,
    },
  ];

  const addons = [
    { name: 'Extra Pages', price: '$0.50 per page' },
    { name: 'Gift Box', price: '$5' },
    { name: 'Rush Production (3 days)', price: '$15' },
    { name: 'Photo Enhancement', price: 'Free' },
    { name: 'Digital PDF Copy', price: '$10' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Premium quality at prices that make sense. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className={`relative rounded-2xl p-8 ${
                  product.popular
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white ring-4 ring-blue-200 shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-1 ${product.popular ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h3>
                  <div className={`text-sm font-medium ${product.popular ? 'text-blue-100' : 'text-blue-600'}`}>
                    {product.subtitle}
                  </div>
                  <div className="mt-4">
                    {product.originalPrice && (
                      <div className={`text-lg line-through ${product.popular ? 'text-blue-200' : 'text-gray-400'}`}>
                        {product.originalPrice}
                      </div>
                    )}
                    <div className={`text-4xl font-bold ${product.popular ? 'text-white' : 'text-gray-900'}`}>
                      {product.price}
                    </div>
                    <div className={`text-sm ${product.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                      starting price
                    </div>
                  </div>
                  <p className={`mt-4 text-sm ${product.popular ? 'text-blue-50' : 'text-gray-600'}`}>
                    {product.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 ${product.popular ? 'text-blue-200' : 'text-blue-600'}`} />
                      <span className={`text-sm ${product.popular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={product.href}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    product.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-50'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {product.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Add-Ons & Extras
          </h2>
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <ul className="space-y-4">
              {addons.map((addon) => (
                <li key={addon.name} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <span className="text-gray-900 font-medium">{addon.name}</span>
                  <span className="text-blue-600 font-bold">{addon.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              100% Satisfaction Guarantee
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              If you're not completely happy with your photo book, we'll reprint
              it for free or give you a full refund. No questions asked.
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-600">
              <div>✓ Free reprints</div>
              <div>✓ 30-day returns</div>
              <div>✓ Quality guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
