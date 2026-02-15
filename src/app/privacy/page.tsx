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
