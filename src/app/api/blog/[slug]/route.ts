import { NextResponse } from 'next/server';
import { mockBlogPosts } from '@/lib/data/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}
