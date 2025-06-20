
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';

  // Allow access to API routes, Next.js specific paths, and static assets unconditionally
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.includes('.') // Generally for files like favicon.ico, images etc.
     ) {
    return NextResponse.next();
  }
  
  // If trying to access admin login page
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      // If already authenticated, redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Allow access to login page if not authenticated
    return NextResponse.next();
  }

  // If trying to access any other admin page (anything starting with /admin/)
  if (pathname.startsWith('/admin/')) {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Handle the root /admin path specifically
  if (pathname === '/admin' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }


  return NextResponse.next();
}

export const config = {
  // Match all routes to apply the logic, and then conditionally protect /admin/*
  // The matcher should be broad, and the logic inside middleware should specify what to protect.
  // Exclude API routes, static files, etc., from running the middleware if possible,
  // or handle them inside the middleware function.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/', // Ensure root is also matched if necessary for public pages
  ],
};
