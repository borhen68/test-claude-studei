import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/verify-email', '/upload', '/book'];
const authPaths = ['/login', '/signup', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('frametale_session');

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  // Check if the path is an auth page
  const isAuthPath = authPaths.some(path => pathname === path);

  // Allow API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (sessionCookie && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not logged in and trying to access protected pages
  if (!sessionCookie && !isPublicPath) {
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
