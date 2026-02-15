import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/auth-schema';
import { requireAuth } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function GET() {
  try {
    const user = await requireAuth();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { name, currentPassword, newPassword } = updateProfileSchema.parse(body);

    const updates: any = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (newPassword && currentPassword) {
      const { verifyPassword } = await import('@/lib/auth/password');
      const isValid = await verifyPassword(currentPassword, user.password);

      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      updates.password = await hashPassword(newPassword);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, user });
    }

    updates.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, user.id))
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
