import { NextRequest, NextResponse } from 'next/server';
import { getUserNotifications, getUnreadCount } from '@/lib/notifications/service';

/**
 * GET /api/notifications
 * Get user notifications
 */
export async function GET(request: NextRequest) {
  try {
    // In a real app, get userId from session/auth
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    
    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(userId, limit),
      getUnreadCount(userId),
    ]);
    
    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
