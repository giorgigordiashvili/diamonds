import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Define supported locales
export const locales = ['en', 'ka'];
export const defaultLocale = 'en';

// JWT secret key - Should be moved to environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simple function to get preferred locale
function getLocale(request) {
  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';

  // Check if Georgian is explicitly requested (checking for 'ka' in the header)
  if (acceptLanguage.includes('ka')) {
    return 'ka';
  }

  // Default to English for all other cases
  return defaultLocale;
}

// Edge-compatible token verification (no MongoDB dependency)
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Extract token from header
function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export function middleware(request) {
  // Get pathname
  const pathname = request.nextUrl.pathname;

  // Admin route protection - this comes first
  if (pathname.startsWith('/admin')) {
    // Check for auth token in cookies or headers
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader) || request.cookies.get('authToken')?.value;

    // If no token, redirect to home
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify token and check if user is admin
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow admin access
    return NextResponse.next();
  }

  // Skip for assets, API routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.') // for file extensions like .jpg, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname already has locale, no need to redirect
  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match everything except specific paths to be excluded
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Specifically match admin routes
    '/admin/:path*',
  ],
};
