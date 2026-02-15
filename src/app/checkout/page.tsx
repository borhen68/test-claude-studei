'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    
    try {
      // TODO: Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      
      const data = await response.json();
      
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Frametale Photo Book</span>
                <span className="font-semibold">$39.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">8x8" hardcover, 24 pages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping (US)</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>$39.00</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Complete Purchase
                </>
              )}
            </button>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Ships in 5-7 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
