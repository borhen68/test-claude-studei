import { Metadata } from 'next';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { generateProductSchema, generateFaqSchema } from '@/lib/seo/structured-data';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = generateProductMetadata('photo-books');

const productSchema = generateProductSchema({
  name: 'Custom Photo Book - 8x8 inch Hardcover',
  description: 'Premium hardcover photo book with 36 pages',
  price: '39.00',
  url: 'https://frametale.com/products/photo-books',
  rating: 4.8,
  reviewCount: 127,
});

export default function PhotoBooksPage() {
  return (
    <>
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold mb-6">Custom Photo Books - Premium Quality from $39</h1>
          <p className="text-xl text-gray-700 mb-8">
            Create beautiful hardcover photo books online. Upload photos, auto-layout, fast delivery. 
            8x8", 10x10", 12x12" sizes available.
          </p>
          <a href="/upload" className="inline-block px-8 py-4 bg-orange-500 text-white rounded-lg font-bold">
            Create Your Photo Book
          </a>
        </div>
        <Footer />
      </div>
    </>
  );
}
