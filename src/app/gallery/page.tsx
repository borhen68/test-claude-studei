import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { galleryImages } from '@/lib/data/mock-data';

export const metadata = {
  title: 'Gallery - Frametale',
  description: 'Browse beautiful photo book examples and get inspired for your own creation.',
};

export default function GalleryPage() {
  const categories = ['All', 'Wedding', 'Travel', 'Family', 'Baby', 'Events'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get Inspired
          </h1>
          <p className="text-xl text-gray-600">
            Browse our collection of beautiful photo books created by customers like you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-6 py-2 rounded-lg font-medium transition-all hover:bg-blue-600 hover:text-white bg-gray-100 text-gray-700"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 overflow-hidden group-hover:scale-105 transition-transform shadow-lg" />
                <div className="px-2">
                  <div className="text-sm font-semibold text-blue-600 mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Create Yours?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload your photos and see your story come to life in minutes.
          </p>
          <a
            href="/upload"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all"
          >
            Start Creating
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
