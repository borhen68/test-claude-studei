import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResets } from '@/lib/db/auth-schema';
import { hashPassword, generateToken } from '@/lib/auth/password';
import { eq, and, gt } from 'drizzle-orm';
import { z } from 'zod';

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Request password reset
    if ('email' in body && !('token' in body)) {
      const { email } = requestResetSchema.parse(body);

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      // Always return success to prevent email enumeration
      if (!user) {
        return NextResponse.json({
          success: true,
          message: 'If an account exists, a reset link will be sent',
        });
      }

      // Generate reset token
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await db.insert(passwordResets).values({
        userId: user.id,
        token,
        expiresAt,
      });

      // TODO: Send password reset email
      // await sendPasswordResetEmail(user.email, token);

      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link will be sent',
      });
    }

    // Reset password with token
    if ('token' in body && 'password' in body) {
      const { token, password } = resetPasswordSchema.parse(body);

      const [reset] = await db
        .select()
        .from(passwordResets)
        .where(
          and(
            eq(passwordResets.token, token),
            eq(passwordResets.used, false),
            gt(passwordResets.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!reset) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await hashPassword(password);

      // Update user password
      await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, reset.userId));

      // Mark token as used
      await db
        .update(passwordResets)
        .set({ used: true })
        .where(eq(passwordResets.id, reset.id));

      return NextResponse.json({
        success: true,
        message: 'Password reset successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
