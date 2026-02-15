import { NextRequest, NextResponse } from 'next/server';
import { markAsRead, markAllAsRead } from '@/lib/notifications/service';

/**
 * POST /api/notifications/read
 * Mark notification(s) as read
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationId, markAll } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    if (markAll) {
      await markAllAsRead(userId);
      return NextResponse.json({ success: true, markedAll: true });
    }
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId is required when markAll is false' },
        { status: 400 }
      );
    }
    
    const notification = await markAsRead(notificationId, userId);
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
