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
