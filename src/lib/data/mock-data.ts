import { BlogPost, Testimonial } from '../types/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    slug: 'preserving-family-memories',
    title: 'The Art of Preserving Family Memories',
    excerpt: 'Learn how to turn your family photos into beautiful keepsakes that will last for generations.',
    content: `# The Art of Preserving Family Memories

In today's digital age, we take thousands of photos but rarely print them. Learn how to create beautiful photo books that preserve your family's most precious moments.

## Why Print Matters

Digital photos can be lost, corrupted, or forgotten on hard drives. Physical photo books become family heirlooms that can be passed down through generations.

## Getting Started

1. **Select Your Best Photos** - Quality over quantity
2. **Organize by Theme** - Vacations, celebrations, everyday moments
3. **Add Context** - Captions, dates, and stories make photos meaningful
4. **Choose the Right Format** - Different books for different occasions

## Tips for Great Photo Books

- Mix landscape and portrait orientations
- Include candid moments, not just posed photos
- Leave white space for a clean, professional look
- Add personal touches with handwritten notes

Start preserving your memories today with Frametale's easy-to-use platform!`,
    coverImage: '/images/blog/family-memories.jpg',
    author: {
      name: 'Sarah Johnson',
      avatar: '/images/avatars/sarah.jpg',
      bio: 'Professional photographer and memory keeper',
    },
    category: 'Tips & Tricks',
    tags: ['family', 'memories', 'photo books'],
    publishedAt: '2024-02-10',
    readingTime: 5,
    featured: true,
  },
  {
    slug: 'travel-photo-book-ideas',
    title: '10 Creative Travel Photo Book Ideas',
    excerpt: 'Turn your vacation photos into stunning travel albums with these creative ideas and layouts.',
    content: `# 10 Creative Travel Photo Book Ideas

Your vacation photos deserve better than sitting on your phone. Here are 10 creative ways to showcase your travel memories.

## 1. Chronological Journey

Tell the story of your trip from departure to return, creating a narrative flow.

## 2. Location-Based Chapters

Organize by destinations visited for easy reference.

## 3. Theme-Based Collections

Group photos by themes: food, architecture, people, landscapes.

## 4. Travel Journal Style

Combine photos with journal entries, tickets, and maps.

## 5. Before & After

Show iconic locations in different lighting or seasons.

## 6. Local Culture Focus

Highlight the people and traditions you encountered.

## 7. Food & Dining Adventures

Create a culinary journey through your trip.

## 8. Hidden Gems

Feature off-the-beaten-path discoveries.

## 9. Aerial & Panoramic Views

Showcase sweeping vistas and drone photography.

## 10. Black & White Artistic

Create a timeless, artistic collection.

Ready to create your travel masterpiece? Start with Frametale today!`,
    coverImage: '/images/blog/travel-ideas.jpg',
    author: {
      name: 'Mike Chen',
      avatar: '/images/avatars/mike.jpg',
      bio: 'Travel photographer and adventurer',
    },
    category: 'Inspiration',
    tags: ['travel', 'ideas', 'layouts'],
    publishedAt: '2024-02-08',
    readingTime: 7,
    featured: true,
  },
  {
    slug: 'choosing-the-right-paper',
    title: 'Choosing the Right Paper for Your Photo Book',
    excerpt: 'Understanding paper types and finishes to make your photos look their absolute best.',
    content: `# Choosing the Right Paper for Your Photo Book

The paper you choose can make or break your photo book. Here's everything you need to know.

## Paper Types

### Glossy
- Vibrant colors and deep blacks
- Best for high-contrast images
- Can show fingerprints

### Matte
- Reduced glare, elegant finish
- Great for portraits
- More resistant to wear

### Lustre (Satin)
- Best of both worlds
- Slight sheen without heavy glare
- Professional favorite

## Paper Weight

- **Standard (100-150 gsm)**: Budget-friendly, suitable for most uses
- **Premium (200-250 gsm)**: Luxurious feel, better durability
- **Ultra (300+ gsm)**: Gallery-quality, maximum impact

## When to Use What

- **Wedding Albums**: Lustre or matte, premium weight
- **Travel Books**: Glossy for vibrant landscapes
- **Family Yearbooks**: Matte for timeless appeal
- **Art Portfolios**: Ultra-premium matte

Make the right choice for your project with Frametale's paper options!`,
    coverImage: '/images/blog/paper-guide.jpg',
    author: {
      name: 'Emily Rodriguez',
      avatar: '/images/avatars/emily.jpg',
      bio: 'Print specialist and designer',
    },
    category: 'Guides',
    tags: ['printing', 'paper', 'quality'],
    publishedAt: '2024-02-05',
    readingTime: 4,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jessica Martin',
    avatar: '/images/avatars/testimonial-1.jpg',
    rating: 5,
    text: 'Absolutely stunning quality! The AI layout suggestions were perfect and saved me hours. My family loved the wedding album.',
    productType: 'Wedding Album',
    createdAt: '2024-02-12',
    featured: true,
  },
  {
    id: '2',
    name: 'David Thompson',
    avatar: '/images/avatars/testimonial-2.jpg',
    rating: 5,
    text: 'Best photo book service I\'ve used. The process was so easy, and the final product exceeded my expectations.',
    productType: 'Travel Photo Book',
    createdAt: '2024-02-10',
    featured: true,
  },
  {
    id: '3',
    name: 'Amanda Lee',
    avatar: '/images/avatars/testimonial-3.jpg',
    rating: 5,
    text: 'The print quality is exceptional. Colors are vibrant and true to life. Will definitely order again!',
    productType: 'Family Yearbook',
    createdAt: '2024-02-08',
    featured: true,
  },
  {
    id: '4',
    name: 'Robert Garcia',
    avatar: '/images/avatars/testimonial-4.jpg',
    rating: 4,
    text: 'Great experience overall. The upload process was smooth and the book arrived quickly.',
    productType: 'Photo Book',
    createdAt: '2024-02-06',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    avatar: '/images/avatars/testimonial-5.jpg',
    rating: 5,
    text: 'Love how the AI organized my vacation photos! Made a professional-looking book in minutes.',
    productType: 'Travel Album',
    createdAt: '2024-02-04',
    featured: true,
  },
];

export const galleryImages = [
  {
    id: '1',
    title: 'Summer Memories',
    description: 'A beautiful collection of summer vacation photos',
    thumbnail: '/images/gallery/summer-1.jpg',
    category: 'Travel',
  },
  {
    id: '2',
    title: 'Wedding Day',
    description: 'Elegant wedding album with classic layouts',
    thumbnail: '/images/gallery/wedding-1.jpg',
    category: 'Wedding',
  },
  {
    id: '3',
    title: 'Family Yearbook 2024',
    description: 'A year of family memories in one beautiful book',
    thumbnail: '/images/gallery/family-1.jpg',
    category: 'Family',
  },
  {
    id: '4',
    title: 'European Adventure',
    description: 'Three weeks exploring Europe',
    thumbnail: '/images/gallery/europe-1.jpg',
    category: 'Travel',
  },
  {
    id: '5',
    title: 'Baby\'s First Year',
    description: 'Precious moments from the first year',
    thumbnail: '/images/gallery/baby-1.jpg',
    category: 'Baby',
  },
  {
    id: '6',
    title: 'Graduation Memories',
    description: 'Celebrating a major milestone',
    thumbnail: '/images/gallery/grad-1.jpg',
    category: 'Events',
  },
];
