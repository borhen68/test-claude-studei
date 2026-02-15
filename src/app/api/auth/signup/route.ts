import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/auth-schema';
import { hashPassword, generateToken } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = signupSchema.parse(body);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateToken();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || undefined,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      })
      .returning();

    await createSession(newUser.id, newUser.email);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        emailVerified: newUser.emailVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
