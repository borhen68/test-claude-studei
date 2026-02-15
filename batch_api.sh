#!/bin/bash

# Blog API - Get all posts
cat > src/app/api/blog/route.ts << 'EOF'
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
EOF

# Blog API - Get single post
cat > src/app/api/blog/[slug]/route.ts << 'EOF'
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
EOF

# Contact API
cat > src/app/api/contact/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // TODO: Send email via SendGrid/Resend
    // For now, just log it
    console.log('Contact form submission:', { name, email, subject, message });

    // Mock email sending
    // await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({ 
      success: true,
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
EOF

# Newsletter API
cat > src/app/api/newsletter/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // TODO: Add to newsletter service (Mailchimp, ConvertKit, etc.)
    console.log('Newsletter subscription:', email);

    // Mock subscription
    // await subscribeToNewsletter(email);

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
EOF

# Testimonials API
cat > src/app/api/testimonials/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { mockTestimonials } from '@/lib/data/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');

  let testimonials = mockTestimonials;

  if (featured === 'true') {
    testimonials = testimonials.filter((t) => t.featured);
  }

  return NextResponse.json({ testimonials, count: testimonials.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, text, productType } = body;

    // Validation
    if (!name || !email || !rating || !text || !productType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    console.log('New testimonial:', { name, email, rating, text, productType });

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your review!' 
    });
  } catch (error) {
    console.error('Testimonial submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
EOF

# Admin Blog API
cat > src/app/api/admin/blog/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { mockBlogPosts } from '@/lib/data/mock-data';

// Simple auth check (in production, use proper authentication)
function checkAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  // TODO: Implement proper authentication
  return authHeader === 'Bearer admin-token';
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ posts: mockBlogPosts });
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, category, tags, coverImage, author } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // TODO: Save to database
    const newPost = {
      slug,
      title,
      excerpt: excerpt || '',
      content,
      coverImage: coverImage || '/images/blog/default.jpg',
      author: author || { name: 'Admin', avatar: '', bio: '' },
      category: category || 'Uncategorized',
      tags: tags || [],
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: Math.ceil(content.split(' ').length / 200),
      featured: false,
    };

    console.log('New blog post created:', newPost);

    return NextResponse.json({ 
      success: true,
      post: newPost,
      message: 'Blog post created successfully!' 
    });
  } catch (error) {
    console.error('Blog post creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, updates } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    // TODO: Update in database
    console.log('Blog post updated:', { slug, updates });

    return NextResponse.json({ 
      success: true,
      message: 'Blog post updated successfully!' 
    });
  } catch (error) {
    console.error('Blog post update error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    // TODO: Delete from database
    console.log('Blog post deleted:', slug);

    return NextResponse.json({ 
      success: true,
      message: 'Blog post deleted successfully!' 
    });
  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
EOF

echo "API routes created!"
