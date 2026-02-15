import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Upload, Sparkles, Eye, Package } from 'lucide-react';

export const metadata = {
  title: 'How It Works - Frametale',
  description: 'Create beautiful photo books in 4 simple steps with our AI-powered platform.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload Your Photos',
      description: 'Drag and drop your favorite photos from your device, phone, or cloud storage. Upload as many as you like!',
      details: [
        'Supports JPG, PNG, and HEIC formats',
        'Bulk upload up to 500 photos',
        'Direct import from Google Photos, iCloud',
        'Automatic quality enhancement',
      ],
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'AI Creates Your Layout',
      description: 'Our smart algorithm analyzes your photos and creates professional layouts automatically in seconds.',
      details: [
        'Intelligent photo grouping by date & location',
        'Professional design templates',
        'Automatic color matching',
        'Portrait/landscape optimization',
      ],
    },
    {
      number: '03',
      icon: Eye,
      title: 'Preview & Customize',
      description: 'Review your book page by page. Easily rearrange photos, add captions, or let our AI handle it all.',
      details: [
        'Interactive page-by-page preview',
        'Drag-and-drop photo reordering',
        'Add text and captions',
        'Change layouts with one click',
      ],
    },
    {
      number: '04',
      icon: Package,
      title: 'Print & Deliver',
      description: 'We print your book using premium materials and ship it to your door within 5-7 business days.',
      details: [
        'Premium paper quality',
        'Professional binding',
        'Protective packaging',
        'Track your order online',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Creating Beautiful Books Has Never Been Easier
          </h1>
          <p className="text-xl text-gray-600">
            Our AI-powered platform does the heavy lifting so you can focus on
            your memories, not layout design.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="text-sm font-bold text-blue-600 mb-2">
                  STEP {step.number}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <step.icon className="h-8 w-8 text-blue-600" />
                  {step.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            From Upload to Delivery
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                0
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Upload Complete</div>
                <div className="text-gray-600">Your photos are uploaded and analyzed</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">AI Processing</div>
                <div className="text-gray-600">Layout generation and optimization</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Your Review</div>
                <div className="text-gray-600">Preview and customize (take your time!)</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                10
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Order Placed</div>
                <div className="text-gray-600">Book sent to production</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                7d
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Delivered!</div>
                <div className="text-gray-600">Your beautiful book arrives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your first photo book in under 10 minutes.
          </p>
          <a
            href="/upload"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-500 transition-all"
          >
            Start Creating
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
