import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(
      `<html><body><script>window.opener.postMessage({ type: 'GOOGLE_PHOTOS_AUTH_ERROR', error: '${error}' }, '*'); window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body><script>window.opener.postMessage({ type: 'GOOGLE_PHOTOS_AUTH_ERROR', error: 'No authorization code' }, '*'); window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_PHOTOS_CLIENT_ID,
        client_secret: process.env.GOOGLE_PHOTOS_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_PHOTOS_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    if (tokens.error) throw new Error(tokens.error_description || tokens.error);

    return new NextResponse(
      `<html><body><script>window.opener.postMessage({ type: 'GOOGLE_PHOTOS_AUTH_SUCCESS', accessToken: '${tokens.access_token}' }, '*'); window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error: any) {
    return new NextResponse(
      `<html><body><script>window.opener.postMessage({ type: 'GOOGLE_PHOTOS_AUTH_ERROR', error: '${error.message}' }, '*'); window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
