import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_PHOTOS_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_PHOTOS_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/import/google-photos/callback`;
  
  if (!clientId) {
    return new NextResponse(
      `<html><body><script>
        window.opener.postMessage({ 
          type: 'GOOGLE_PHOTOS_AUTH_ERROR', 
          error: 'Google Photos integration not configured. See docs/GOOGLE_PHOTOS_SETUP.md'
        }, '*');
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const scopes = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(authUrl.toString());
}
