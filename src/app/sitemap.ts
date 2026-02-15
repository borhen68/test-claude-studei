import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://frametale.com';
  
  // Static pages
  const routes = [
    '',
    '/products/photo-books',
    '/products/calendars',
    '/products/cards',
    '/how-it-works',
    '/pricing',
    '/gallery',
    '/contact',
    '/about',
    '/faq',
    '/blog',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/products') ? 0.9 : 0.8,
  }));

  // Blog posts - we'll fetch these from database when available
  // For now, return static routes
  // TODO: Fetch blog posts from database
  /*
  const posts = await getBlogPosts();
  const blogRoutes = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...routes, ...blogRoutes];
  */

  return routes;
}
