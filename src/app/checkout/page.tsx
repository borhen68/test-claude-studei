'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Check, Package, Truck, CreditCard, MapPin, 
  ChevronRight, Lock, Star, Heart, BookOpen, Sparkles, ShieldCheck 
} from 'lucide-react';

// Product Configuration Types
type BookSize = '8x8' | '10x10' | '12x12';
type PaperType = 'standard' | 'premium' | 'lustre';
type CoverType = 'softcover' | 'hardcover' | 'premium-hardcover';

interface ProductConfig {
  size: BookSize;
  paperType: PaperType;
  coverType: CoverType;
  quantity: number;
}

interface PricingBreakdown {
  basePrice: number;
  sizeUpcharge: number;
  paperUpcharge: number;
  coverUpcharge: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const SIZE_OPTIONS = [
  { value: '8x8' as BookSize, label: '8×8"', description: 'Perfect for coffee tables', price: 0 },
  { value: '10x10' as BookSize, label: '10×10"', description: 'Large, statement piece', price: 2000 },
  { value: '12x12' as BookSize, label: '12×12"', description: 'Museum quality', price: 4000 },
];

const PAPER_OPTIONS = [
  { value: 'standard' as PaperType, label: 'Standard Matte', description: '100# weight, smooth finish', price: 0 },
  { value: 'premium' as PaperType, label: 'Premium Matte', description: '130# weight, archival quality', price: 1500 },
  { value: 'lustre' as PaperType, label: 'Lustre Finish', description: 'Semi-gloss, photo-lab quality', price: 2000 },
];

const COVER_OPTIONS = [
  { value: 'softcover' as CoverType, label: 'Softcover', description: 'Lightweight, flexible', price: 0 },
  { value: 'hardcover' as CoverType, label: 'Hardcover', description: 'Durable, lay-flat binding', price: 2000 },
  { value: 'premium-hardcover' as CoverType, label: 'Premium Hardcover', description: 'Linen-wrapped, gilded edges', price: 4000 },
];

const BASE_PRICE = 3999; // $39.99
const SHIPPING_COST = 999; // $9.99
const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');
  
  const [step, setStep] = useState<'customize' | 'shipping' | 'payment' | 'processing' | 'success'>('customize');
  const [config, setConfig] = useState<ProductConfig>({
    size: '8x8',
    paperType: 'standard',
    coverType: 'hardcover',
    quantity: 1,
  });
  
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

  const [bookPreview, setBookPreview] = useState<any>(null);

  useEffect(() => {
    if (!bookId) {
      router.push('/');
      return;
    }
    
    // Fetch book preview
    fetch(`/api/books/${bookId}`)
      .then(res => res.json())
      .then(data => setBookPreview(data.book))
      .catch(console.error);
  }, [bookId, router]);

  // Calculate pricing
  const calculatePricing = (): PricingBreakdown => {
    const sizeOption = SIZE_OPTIONS.find(s => s.value === config.size);
    const paperOption = PAPER_OPTIONS.find(p => p.value === config.paperType);
    const coverOption = COVER_OPTIONS.find(c => c.value === config.coverType);
    
    const sizeUpcharge = (sizeOption?.price || 0) * config.quantity;
    const paperUpcharge = (paperOption?.price || 0) * config.quantity;
    const coverUpcharge = (coverOption?.price || 0) * config.quantity;
    const subtotal = (BASE_PRICE * config.quantity) + sizeUpcharge + paperUpcharge + coverUpcharge;
    const shipping = SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + shipping + tax;

    return {
      basePrice: BASE_PRICE * config.quantity,
      sizeUpcharge,
      paperUpcharge,
      coverUpcharge,
      subtotal,
      shipping,
      tax,
      total,
    };
  };

  const pricing = calculatePricing();

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Create order via API
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          config,
          shipping: shippingInfo,
          pricing,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to confirmation page
        router.push(`/checkout/confirmation?orderId=${data.orderId}`);
      } else {
        alert('Order failed: ' + data.error);
        setStep('payment');
      }
    } catch (error) {
      alert('Order failed. Please try again.');
      setStep('payment');
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <Loader2 className="h-16 w-16 text-amber-600 animate-spin mx-auto" />
            <Sparkles className="h-6 w-6 text-rose-500 absolute top-0 right-1/3 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating your order...</h2>
          <p className="text-gray-600">This will just take a moment</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
              Frametale
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[
              { key: 'customize', label: 'Customize', icon: Sparkles },
              { key: 'shipping', label: 'Shipping', icon: MapPin },
              { key: 'payment', label: 'Payment', icon: CreditCard },
            ].map((s, index) => {
              const stepKeys = ['customize', 'shipping', 'payment'];
              const currentIndex = stepKeys.indexOf(step);
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={s.key} className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`hidden md:block font-medium transition-colors ${
                        isCurrent ? 'text-gray-900' : isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <ChevronRight
                      className={`w-5 h-5 ${isActive ? 'text-gray-400' : 'text-gray-300'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'customize' && (
                <motion.div
                  key="customize"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Customize Your Book
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Choose the perfect options for your memory book
                    </p>

                    {/* Size Selection */}
                    <div className="mb-8">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Book Size
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SIZE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setConfig({ ...config, size: option.value })}
                            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                              config.size === option.value
                                ? 'border-amber-500 bg-amber-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {config.size === option.value && (
                              <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div className="font-bold text-xl text-gray-900 mb-1">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              {option.description}
                            </div>
                            <div className="text-sm font-semibold text-amber-700">
                              {option.price > 0 ? `+${formatPrice(option.price)}` : 'Included'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Paper Type */}
                    <div className="mb-8">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Paper Type
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PAPER_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setConfig({ ...config, paperType: option.value })}
                            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                              config.paperType === option.value
                                ? 'border-amber-500 bg-amber-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {config.paperType === option.value && (
                              <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div className="font-bold text-lg text-gray-900 mb-1">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              {option.description}
                            </div>
                            <div className="text-sm font-semibold text-amber-700">
                              {option.price > 0 ? `+${formatPrice(option.price)}` : 'Included'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cover Type */}
                    <div className="mb-8">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Cover Type
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {COVER_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setConfig({ ...config, coverType: option.value })}
                            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                              config.coverType === option.value
                                ? 'border-amber-500 bg-amber-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {config.coverType === option.value && (
                              <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div className="font-bold text-lg text-gray-900 mb-1">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              {option.description}
                            </div>
                            <div className="text-sm font-semibold text-amber-700">
                              {option.price > 0 ? `+${formatPrice(option.price)}` : 'Included'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-8">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Quantity
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-700 font-bold text-xl"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={config.quantity}
                          onChange={(e) => setConfig({ ...config, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-20 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={() => setConfig({ ...config, quantity: Math.min(20, config.quantity + 1) })}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-700 font-bold text-xl"
                        >
                          +
                        </button>
                        {config.quantity > 1 && (
                          <span className="ml-4 text-sm text-green-700 font-medium bg-green-50 px-3 py-1 rounded-full">
                            Save on bulk orders!
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep('shipping')}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold text-lg rounded-xl hover:shadow-xl transition-all hover:scale-[1.02]"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Shipping Information
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Where should we send your beautiful book?
                  </p>

                  <form onSubmit={handleShippingSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                        placeholder="you@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">We'll send order confirmation here</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          placeholder="CA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                        placeholder="94102"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep('customize')}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Payment Information
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Safe and secure checkout with Stripe
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-amber-700 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        Test Mode Active
                      </p>
                      <p className="text-xs text-amber-800">
                        Use card number <code className="bg-amber-100 px-2 py-0.5 rounded">4242 4242 4242 4242</code> with any future expiry and CVC
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition font-mono"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cvc}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.name}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-blue-700" />
                      <p className="text-sm text-blue-900">
                        Your payment information is encrypted and secure
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <Lock className="w-5 h-5" />
                        Place Order · {formatPrice(pricing.total)}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              {/* Book Preview */}
              {bookPreview && (
                <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-rose-100 p-4">
                  <div className="aspect-square bg-white rounded-lg shadow-sm flex items-center justify-center">
                    {bookPreview.coverImageUrl ? (
                      <img 
                        src={bookPreview.coverImageUrl} 
                        alt="Book cover" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="w-20 h-20 text-gray-300" />
                    )}
                  </div>
                  <p className="text-center mt-3 font-semibold text-gray-900">
                    {bookPreview.title || 'Your Photo Book'}
                  </p>
                </div>
              )}

              {/* Configuration Summary */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Size:</span>
                  <span className="font-semibold">
                    {SIZE_OPTIONS.find(s => s.value === config.size)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Paper:</span>
                  <span className="font-semibold">
                    {PAPER_OPTIONS.find(p => p.value === config.paperType)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Cover:</span>
                  <span className="font-semibold">
                    {COVER_OPTIONS.find(c => c.value === config.coverType)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Quantity:</span>
                  <span className="font-semibold">{config.quantity}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Base price</span>
                  <span>{formatPrice(pricing.basePrice)}</span>
                </div>
                {pricing.sizeUpcharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Size upgrade</span>
                    <span>{formatPrice(pricing.sizeUpcharge)}</span>
                  </div>
                )}
                {pricing.paperUpcharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Paper upgrade</span>
                    <span>{formatPrice(pricing.paperUpcharge)}</span>
                  </div>
                )}
                {pricing.coverUpcharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Cover upgrade</span>
                    <span>{formatPrice(pricing.coverUpcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatPrice(pricing.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(pricing.tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                    {formatPrice(pricing.total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Ships in 5-7 business days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>100% satisfaction guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>10,000+ happy customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
