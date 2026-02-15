import { Metadata } from 'next';
import { staticPageMetadata } from '@/lib/seo/metadata';
import { generateHowToSchema } from '@/lib/seo/structured-data';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Upload, Sparkles, Eye, Package } from 'lucide-react';

export const metadata: Metadata = staticPageMetadata['how-it-works'];

const howToSchema = generateHowToSchema({
  name: 'How to Make a Photo Book in 3 Easy Steps',
  description: 'Learn how to create a custom photo book with Frametale in just minutes.',
  totalTime: 'PT15M',
  steps: [
    {
      name: 'Upload Your Photos',
      text: 'Select photos from your device, Google Photos, or Instagram. Upload as many as you want.',
      image: '/images/step-upload.jpg'
    },
    {
      name: 'Auto-Generate Beautiful Layouts',
      text: 'Our AI creates professional layouts instantly. Choose from themes like Classic, Modern, Vintage, or Travel.',
      image: '/images/step-design.jpg'
    },
    {
      name: 'Review, Customize & Order',
      text: 'Preview your book, make any adjustments, add text or captions, then order. Fast 5-7 day delivery.',
      image: '/images/step-order.jpg'
    }
  ]
});

export default function HowItWorksPage() {
  return (
    <>
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                How to Make a Photo Book in 3 Easy Steps
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Create a stunning custom photo book in minutes. No design skills required. 
                Our AI does the hard work for you.
              </p>
              <a 
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                <Upload className="h-5 w-5" />
                Start Creating Now
              </a>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="space-y-24">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold text-xl mb-4">
                  1
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Upload Your Photos
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Choose photos from your device, Google Photos, or Instagram. Upload as many as you want—our smart selection helps you pick the best ones.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Upload from multiple sources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>AI detects blurry or low-quality photos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Smart suggestions for best photos</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-12 flex items-center justify-center">
                <Upload className="w-32 h-32 text-orange-500" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-12 flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-pink-500" />
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 font-bold text-xl mb-4">
                  2
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Auto-Generate Beautiful Layouts
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our AI creates professional layouts instantly. Choose from themes like Classic, Modern, Vintage, or Travel. We handle the design—you just approve.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Professional layouts in seconds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Multiple theme options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Smart photo arrangement</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-4">
                  3
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Review, Customize & Order
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Preview your book page-by-page. Make any adjustments, add text or captions, choose your cover, then order. Delivered in 5-7 days.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Easy drag-and-drop customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Add captions and dates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Multiple size options (8x8", 10x10", 12x12")</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Fast 5-7 day delivery</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-12 flex items-center justify-center">
                <Package className="w-32 h-32 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Why Frametale Makes It Easy
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Intelligent Automatic Design</h3>
                <p className="text-gray-600">
                  Our smart algorithm creates professional layouts automatically. No design experience needed.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
                <p className="text-gray-600">
                  Premium 250 GSM paper, hardcover binding, and professional printing. 100% satisfaction guaranteed.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
                <p className="text-gray-600">
                  Your custom photo book arrives in 5-7 days. Express shipping available for rush orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your Photo Book?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of happy customers who've turned their photos into beautiful books.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
            >
              <Upload className="h-5 w-5" />
              Start Your Book Now
            </a>
            <p className="text-white/80 mt-6">
              No account needed • 100% satisfaction guarantee • From $39
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
