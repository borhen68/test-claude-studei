#!/bin/bash

# FAQ Page
cat > src/app/faq/page.tsx << 'EOF'
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'FAQ - Frametale',
  description: 'Frequently asked questions about creating and ordering photo books.',
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'Ordering',
      questions: [
        {
          q: 'How long does it take to create a photo book?',
          a: 'Most customers create their book in under 10 minutes! Upload your photos, let our AI generate layouts, review and customize if desired, then checkout. The entire process is designed to be quick and intuitive.',
        },
        {
          q: 'What file formats do you accept?',
          a: 'We accept JPG, PNG, and HEIC formats. For best results, we recommend high-resolution images (at least 1800x1200 pixels for full-page photos).',
        },
        {
          q: 'Can I save my book and finish it later?',
          a: 'Yes! Your project is automatically saved to your account. You can come back anytime to continue editing or place your order.',
        },
      ],
    },
    {
      category: 'Printing & Quality',
      questions: [
        {
          q: 'What kind of paper do you use?',
          a: 'We offer premium matte, glossy, and lustre paper options. All our paper is archival-quality and designed to last for generations without fading.',
        },
        {
          q: 'What if my photos are low resolution?',
          a: 'Our system will alert you if any photos are too low resolution. We also offer optional AI photo enhancement to improve quality.',
        },
        {
          q: 'Do you offer samples?',
          a: 'We offer a sample kit with paper swatches and binding samples for $5 (credited back on your first order over $50).',
        },
      ],
    },
    {
      category: 'Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard production is 5-7 business days, plus 3-5 days for shipping. Rush production (3 days) is available for $15.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes! We ship to over 50 countries. International shipping takes 10-15 business days.',
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! You'll receive tracking information via email as soon as your order ships.',
        },
      ],
    },
    {
      category: 'Returns & Guarantee',
      questions: [
        {
          q: 'What is your satisfaction guarantee?',
          a: 'We offer a 100% satisfaction guarantee. If you're not happy with your book for any reason, we'll reprint it for free or provide a full refund within 30 days.',
        },
        {
          q: 'What if my book arrives damaged?',
          a: 'Contact us immediately with photos of the damage. We'll send a replacement at no charge.',
        },
        {
          q: 'Can I cancel my order?',
          a: 'Orders can be cancelled within 24 hours of placement for a full refund. After production has started, we cannot cancel but our satisfaction guarantee still applies.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our photo books.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          {faqs.map((section) => (
            <div key={section.category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.questions.map((faq, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
EOF

# Terms Page
cat > src/app/terms/page.tsx << 'EOF'
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Service - Frametale',
  description: 'Terms and conditions for using Frametale services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: February 15, 2024</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 prose prose-lg">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Frametale's services, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            You agree to use our service only for lawful purposes and in accordance with these Terms.
            You are responsible for all content you upload and must have rights to use all photos.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            You retain all rights to your photos and content. By uploading content, you grant Frametale
            a license to process, store, and print your content for the purpose of fulfilling your orders.
          </p>

          <h2>4. Orders and Payment</h2>
          <p>
            All orders are subject to acceptance and availability. Prices are subject to change without notice.
            Payment is required at the time of order placement.
          </p>

          <h2>5. Refunds and Returns</h2>
          <p>
            We offer a 100% satisfaction guarantee. If you're not satisfied with your product, contact us
            within 30 days for a refund or reprint.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Frametale shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use of our service.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service constitutes
            acceptance of modified terms.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions about these Terms, please contact us at legal@frametale.com
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
EOF

# Privacy Page
cat > src/app/privacy/page.tsx << 'EOF'
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy - Frametale',
  description: 'How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: February 15, 2024</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 prose prose-lg">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Photos and content you upload</li>
            <li>Shipping and billing information</li>
            <li>Communication preferences</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send you order updates and shipping information</li>
            <li>Improve our services and AI algorithms</li>
            <li>Respond to your requests and support needs</li>
            <li>Send marketing communications (with your consent)</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul>
            <li>Service providers who help us fulfill orders (printing, shipping)</li>
            <li>Payment processors for secure transactions</li>
            <li>Analytics providers to improve our service</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your information, including
            encryption, secure servers, and regular security audits.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to improve your experience, analyze usage,
            and deliver personalized content.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect
            information from children under 13.
          </p>

          <h2>8. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any
            significant changes via email or website notice.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For privacy-related questions, contact us at privacy@frametale.com
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
EOF

# Shipping Page
cat > src/app/shipping/page.tsx << 'EOF'
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
EOF

echo "Batch 2 complete!"
