import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

/**
 * Initiate Google Photos OAuth flow
 * GET /api/import/google-photos?bookId=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    return NextResponse.json(
      { success: false, error: 'bookId required' },
      { status: 400 }
    );
  }

  // Store bookId in state for callback
  const state = JSON.stringify({ bookId, nonce: nanoid() });

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', process.env.GOOGLE_REDIRECT_URI!);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/photoslibrary.readonly');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'consent'); // Force consent to get refresh token

  return NextResponse.redirect(authUrl.toString());
}
