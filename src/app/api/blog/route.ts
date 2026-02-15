import { NextResponse } from 'next/server';
import { mockBlogPosts } from '@/lib/data/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let posts = mockBlogPosts;

  if (category) {
    posts = posts.filter((p) => p.category === category);
  }

  if (featured === 'true') {
    posts = posts.filter((p) => p.featured);
  }

  return NextResponse.json({ posts, count: posts.length });
}
