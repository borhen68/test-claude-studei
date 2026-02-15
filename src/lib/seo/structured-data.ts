// Organization schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Frametale",
  "url": "https://frametale.com",
  "logo": "https://frametale.com/logo.png",
  "description": "Premium photo books, calendars, and cards",
  "sameAs": [
    "https://facebook.com/frametale",
    "https://instagram.com/frametale",
    "https://twitter.com/frametale"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@frametale.com",
    "contactType": "Customer Service"
  }
};

// Product schema for photo books
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  url: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image || "https://frametale.com/og-image.jpg",
    "brand": {
      "@type": "Brand",
      "name": "Frametale"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.priceCurrency || "USD",
      "availability": "https://schema.org/InStock",
      "url": product.url
    },
    ...(product.rating && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviewCount.toString()
      }
    } : {})
  };
}

// Review schema
export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  text: string;
  date?: string;
}>) {
  return reviews.map(review => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": "Frametale Photo Book"
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating.toString(),
      "bestRating": "5"
    },
    "reviewBody": review.text,
    ...(review.date ? { "datePublished": review.date } : {})
  }));
}

// FAQ schema
export function generateFaqSchema(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{
  name: string;
  url: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Article schema for blog posts
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || "https://frametale.com/og-blog.jpg",
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Frametale",
      "logo": {
        "@type": "ImageObject",
        "url": "https://frametale.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}

// How-to schema for tutorials
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    ...(howTo.totalTime ? { "totalTime": howTo.totalTime } : {}),
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image ? { "image": step.image } : {})
    }))
  };
}
