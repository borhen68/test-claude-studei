import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery - Frametale',
  description: 'Information about shipping times, costs, and delivery options.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Shipping & Delivery
          </h1>
          <p className="text-xl text-gray-600">
            Fast, reliable shipping to your door
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 border-2 border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Standard Shipping
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                FREE
              </div>
              <p className="text-gray-600 mb-4">on orders over $50</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 5-7 business days production</li>
                <li>• 3-5 days shipping</li>
                <li>• Tracking included</li>
                <li>• $5.99 for orders under $50</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Rush Production
              </h3>
              <div className="text-3xl font-bold mb-2">
                $15
              </div>
              <p className="text-blue-100 mb-4">Get it faster!</p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• 3 business days production</li>
                <li>• Priority shipping (2-3 days)</li>
                <li>• Expedited handling</li>
                <li>• Perfect for gifts</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Production Times</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Photo Books</div>
                    <div className="text-sm text-gray-600">5-7 business days</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Calendars</div>
                    <div className="text-sm text-gray-600">3-5 business days</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Cards</div>
                    <div className="text-sm text-gray-600">2-3 business days</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">International Shipping</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 mb-4">
                  We ship to over 50 countries worldwide!
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Canada: 7-10 business days, starting at $12.99</li>
                  <li>• UK & Europe: 10-15 business days, starting at $19.99</li>
                  <li>• Australia & Asia: 15-20 business days, starting at $24.99</li>
                  <li>• Customs fees may apply</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-2">Order Tracking</h4>
              <p className="text-gray-600">
                You'll receive an email with tracking information as soon as your order ships.
                Track your package anytime from your account dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
