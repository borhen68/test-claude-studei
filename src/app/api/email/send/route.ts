import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, template, templateData, userId, orderId, bookId } = body;
    
    if (!to || !subject || !template || !templateData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await sendEmail({ to, subject, template, templateData, userId, orderId, bookId });
    
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
