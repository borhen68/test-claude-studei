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
