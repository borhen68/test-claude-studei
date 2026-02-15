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
