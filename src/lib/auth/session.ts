import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/auth-schema';
import { eq, and, gt } from 'drizzle-orm';
import { COOKIE_NAME, COOKIE_OPTIONS } from './config';
import { createToken, verifyToken } from './jwt';
import type { User } from '@/lib/db/auth-schema';

export async function createSession(userId: string, email: string) {
  const token = createToken({ userId, email });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  (await cookies()).set(COOKIE_NAME, token, COOKIE_OPTIONS);

  return token;
}

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) {
    await destroySession();
    return null;
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    await destroySession();
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    await destroySession();
    return null;
  }

  return { user };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  cookieStore.delete(COOKIE_NAME);
}

export async function requireAuth(): Promise<User> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.user;
}
