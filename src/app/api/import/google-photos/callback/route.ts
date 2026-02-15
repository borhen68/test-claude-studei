import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Photos OAuth callback
 * GET /api/import/google-photos/callback?code=xxx&state=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Failed</title>
      </head>
      <body>
        <script>
          window.opener.postMessage({
            type: 'google-photos-auth-error',
            error: '${error}'
          }, '*');
          window.close();
        </script>
        <p>Authorization failed. You can close this window.</p>
      </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code || !state) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Failed</title>
      </head>
      <body>
        <script>
          window.opener.postMessage({
            type: 'google-photos-auth-error',
            error: 'Missing authorization code'
          }, '*');
          window.close();
        </script>
        <p>Authorization failed. You can close this window.</p>
      </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Success - send code back to opener window
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authorization Successful</title>
    </head>
    <body>
      <script>
        window.opener.postMessage({
          type: 'google-photos-auth-success',
          code: '${code}',
          state: '${state}'
        }, '*');
        window.close();
      </script>
      <p>Authorization successful! Closing window...</p>
    </body>
    </html>
    `,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
