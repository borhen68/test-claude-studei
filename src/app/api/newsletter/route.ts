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
