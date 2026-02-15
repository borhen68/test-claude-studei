import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/auth-schema';
import { eq, and, gt } from 'drizzle-orm';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.emailVerificationToken, token),
          gt(users.emailVerificationExpires, new Date())
        )
      )
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
