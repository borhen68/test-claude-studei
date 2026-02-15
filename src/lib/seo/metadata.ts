import { Metadata } from 'next';

const baseUrl = 'https://frametale.com';

// Homepage metadata
export const homeMetadata: Metadata = {
  title: 'Frametale - Beautiful Photo Books, Calendars & Cards',
  description: 'Turn your photos into stunning photo books, calendars, and greeting cards. Easy upload, smart layouts, fast delivery. From $29.',
  keywords: ['photo book', 'custom photo book', 'photo calendar', 'greeting cards', 'personalized gifts'],
  openGraph: {
    title: 'Frametale - Beautiful Photo Books in Minutes',
    description: 'Create stunning photo books automatically. Upload photos, we do the rest.',
    images: ['/og-image.jpg'],
    type: 'website',
    url: baseUrl,
    siteName: 'Frametale',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frametale - Beautiful Photo Books',
    description: 'Turn your photos into stunning photo books in minutes',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
};

// Product pages metadata
export function generateProductMetadata(product: string): Metadata {
  const data: Record<string, {
    title: string;
    description: string;
    keywords: string[];
  }> = {
    'photo-books': {
      title: 'Custom Photo Books - Premium Quality from $39 | Frametale',
      description: 'Create beautiful hardcover photo books online. Upload photos, auto-layout, fast delivery. 8x8", 10x10", 12x12" sizes available.',
      keywords: ['custom photo book', 'hardcover photo book', 'photo book online', 'make a photo book'],
    },
    'calendars': {
      title: 'Custom Photo Calendars 2026 - Personalized Wall Calendars | Frametale',
      description: 'Design personalized photo calendars for 2026. Start any month, mark important dates, beautiful layouts. From $29.',
      keywords: ['photo calendar 2026', 'custom calendar', 'personalized calendar', 'wall calendar'],
    },
    'cards': {
      title: 'Custom Greeting Cards - Photo Cards Online | Frametale',
      description: 'Create personalized photo greeting cards for any occasion. Birthday, thank you, holiday cards. High quality printing.',
      keywords: ['custom greeting cards', 'photo cards', 'personalized cards', 'custom cards online'],
    },
  };

  const productData = data[product];
  
  return {
    title: productData.title,
    description: productData.description,
    keywords: productData.keywords,
    openGraph: {
      title: productData.title,
      description: productData.description,
      images: [`/og-${product}.jpg`],
      type: 'website',
      url: `${baseUrl}/products/${product}`,
      siteName: 'Frametale',
    },
    twitter: {
      card: 'summary_large_image',
      title: productData.title,
      description: productData.description,
      images: [`/twitter-${product}.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/products/${product}`,
    },
  };
}

// Blog post metadata generator
export function generateBlogMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  publishedAt: string;
  author: string;
}): Metadata {
  return {
    title: `${post.title} | Frametale Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : ['/og-blog.jpg'],
      type: 'article',
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'Frametale',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : ['/twitter-blog.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

// Static page metadata
export const staticPageMetadata: Record<string, Metadata> = {
  'how-it-works': {
    title: 'How to Make a Photo Book in 3 Easy Steps | Frametale',
    description: 'Learn how easy it is to create a custom photo book. Upload photos, auto-generate layouts, customize and order. Fast delivery guaranteed.',
    keywords: ['how to make photo book', 'create photo book', 'photo book tutorial'],
    alternates: { canonical: `${baseUrl}/how-it-works` },
  },
  'pricing': {
    title: 'Photo Book Pricing - Affordable Custom Photo Books from $39 | Frametale',
    description: 'Transparent pricing for custom photo books, calendars, and cards. Premium quality, no hidden fees. From $39 with free shipping on orders over $50.',
    keywords: ['photo book pricing', 'photo book cost', 'custom photo book price'],
    alternates: { canonical: `${baseUrl}/pricing` },
  },
  'gallery': {
    title: 'Photo Book Gallery - Customer Examples & Inspiration | Frametale',
    description: 'Browse beautiful photo books, calendars, and cards created by our customers. Get inspired for your next project.',
    keywords: ['photo book examples', 'photo book ideas', 'custom photo book gallery'],
    alternates: { canonical: `${baseUrl}/gallery` },
  },
  'about': {
    title: 'About Frametale - Our Story & Mission | Frametale',
    description: 'Learn about Frametale\'s mission to make creating beautiful photo books easy and affordable. Meet our team and see why customers love us.',
    keywords: ['about frametale', 'photo book company', 'frametale story'],
    alternates: { canonical: `${baseUrl}/about` },
  },
  'faq': {
    title: 'FAQ - Photo Book Questions Answered | Frametale',
    description: 'Find answers to common questions about creating photo books, calendars, and cards. Shipping, pricing, customization, and more.',
    keywords: ['photo book faq', 'photo book questions', 'custom photo book help'],
    alternates: { canonical: `${baseUrl}/faq` },
  },
  'contact': {
    title: 'Contact Us - Get Help with Your Photo Book | Frametale',
    description: 'Need help? Contact Frametale support via email or live chat. We\'re here to help with your custom photo book, calendar, or card questions.',
    keywords: ['contact frametale', 'photo book support', 'customer service'],
    alternates: { canonical: `${baseUrl}/contact` },
  },
};
