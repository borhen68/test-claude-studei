import { db } from '../db';
import { notifications, users } from '../db/schema-email-notifications';
import { eq, and, desc } from 'drizzle-orm';

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  bookId?: string;
  orderId?: string;
  metadata?: any;
}

/**
 * Create a new in-app notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const [notification] = await db.insert(notifications).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    actionUrl: params.actionUrl,
    actionLabel: params.actionLabel,
    bookId: params.bookId,
    orderId: params.orderId,
    metadata: params.metadata,
    read: false,
  }).returning();
  
  return notification;
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId: string, limit = 50) {
  return db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
  });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const result = await db
    .select()
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.read, false)
    ));
  
  return result.length;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  const [updated] = await db
    .update(notifications)
    .set({
      read: true,
      readAt: new Date(),
    })
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.userId, userId)
    ))
    .returning();
  
  return updated;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  await db
    .update(notifications)
    .set({
      read: true,
      readAt: new Date(),
    })
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.read, false)
    ));
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string) {
  await db
    .delete(notifications)
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.userId, userId)
    ));
}

// ============================================================================
// CONVENIENCE FUNCTIONS FOR COMMON NOTIFICATION TYPES
// ============================================================================

export async function notifyOrderConfirmed(userId: string, orderId: string, bookTitle: string) {
  return createNotification({
    userId,
    type: 'order_confirmed',
    title: 'Order Confirmed! 🎉',
    message: `Your photo book "${bookTitle}" is being created!`,
    actionUrl: `/orders/${orderId}`,
    actionLabel: 'View Order',
    orderId,
  });
}

export async function notifyOrderShipped(userId: string, orderId: string, trackingNumber: string) {
  return createNotification({
    userId,
    type: 'order_shipped',
    title: 'Your Book Has Shipped! 📦',
    message: `Tracking number: ${trackingNumber}`,
    actionUrl: `/orders/${orderId}`,
    actionLabel: 'Track Package',
    orderId,
  });
}

export async function notifyBookReady(userId: string, bookId: string, bookTitle: string) {
  return createNotification({
    userId,
    type: 'book_ready',
    title: 'Your Book is Ready! 📖',
    message: `"${bookTitle}" is ready to view and order.`,
    actionUrl: `/book/${bookId}`,
    actionLabel: 'View Book',
    bookId,
  });
}

export async function notifyProcessingComplete(userId: string, bookId: string) {
  return createNotification({
    userId,
    type: 'processing_complete',
    title: 'Processing Complete! ✨',
    message: 'Your photos have been processed and your book is ready to customize.',
    actionUrl: `/book/${bookId}`,
    actionLabel: 'View Book',
    bookId,
  });
}
