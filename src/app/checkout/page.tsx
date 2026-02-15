'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Check, Package, Truck } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'softcover-8x8',
    name: '8×8" Softcover',
    description: 'Perfect for everyday memories',
    basePrice: 2999,
    image: '/products/softcover-8x8.jpg',
  },
  {
    id: 'hardcover-8x8',
    name: '8×8" Hardcover',
    description: 'Premium quality, lay-flat pages',
    basePrice: 4999,
    image: '/products/hardcover-8x8.jpg',
  },
  {
    id: 'hardcover-10x10',
    name: '10×10" Hardcover',
    description: 'Large format, museum-quality',
    basePrice: 6999,
    image: '/products/hardcover-10x10.jpg',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');
  
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[1]);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'product' | 'shipping' | 'payment' | 'processing' | 'success'>('product');
  
  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  useEffect(() => {
    if (!bookId) {
      router.push('/');
    }
  }, [bookId, router]);

  const subtotal = selectedProduct.basePrice * quantity;
  const shipping = 999; // $9.99
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + shipping + tax;

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleProductContinue = () => {
    setStep('shipping');
  };

  const handleShippingContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          productId: selectedProduct.id,
          quantity,
          shipping: shippingInfo,
          subtotal,
          shippingCost: shipping,
          tax,
          total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('success');
      } else {
        alert('Order failed: ' + data.error);
        setStep('payment');
      }
    } catch (error) {
      alert('Order failed');
      setStep('payment');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We'll send you an email confirmation shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-4 mb-4">
              <Package className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">Your book is being printed</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Delivery</p>
                <p className="text-sm text-gray-600">Estimated 5-7 business days</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500"
          >
            Create Another Book
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {['Product', 'Shipping', 'Payment'].map((label, index) => {
              const stepIndex = ['product', 'shipping', 'payment'].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;

              return (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`font-medium ${
                        isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-16 h-0.5 ${
                        isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'product' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choose Your Book
                </h2>

                <div className="space-y-4 mb-8">
                  {PRODUCTS.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`w-full flex items-center gap-6 p-6 rounded-lg border-2 transition-all text-left ${
                        selectedProduct.id === product.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.basePrice)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-24 rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>

                <button
                  onClick={handleProductContinue}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {step === 'shipping' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>

                <form onSubmit={handleShippingContinue} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.name}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, city: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, state: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.zip}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, zip: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Test Mode:</strong> Use card number 4242 4242 4242 4242
                    with any future expiry and CVC.
                  </p>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                      }
                      placeholder="4242 4242 4242 4242"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.expiry}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, expiry: e.target.value })
                        }
                        placeholder="12/25"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cvc}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, cvc: e.target.value })
                        }
                        placeholder="123"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-500"
                  >
                    Place Order - {formatPrice(total)}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-8 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedProduct.name} × {quantity}
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  ✨ Premium Quality Guaranteed
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Lay-flat binding</li>
                  <li>• Premium matte paper</li>
                  <li>• Professional printing</li>
                  <li>• 100% satisfaction guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
