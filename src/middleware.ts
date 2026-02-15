import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only these paths require authentication
const protectedPaths = ['/dashboard', '/admin'];

// Auth pages - redirect to dashboard if already logged in
const authPaths = ['/login', '/signup', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('frametale_session');

  // Allow API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Check if the path is an auth page
  const isAuthPath = authPaths.some(path => pathname === path);

  // Redirect to dashboard if logged in and trying to access auth pages
  if (sessionCookie && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not logged in and trying to access protected pages
  if (!sessionCookie && isProtectedPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)' ,
  ],
};
