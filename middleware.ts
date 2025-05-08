import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './src/i18n-config';

// JWT secret key - Should be moved to environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simplified JWT verification for Edge Runtime
function verifyTokenEdge(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Extract token from header without importing from auth.ts
function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Simplified locale detection without using Negotiator
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');

  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim());

    for (const lang of languages) {
      const shortLang = lang.toLowerCase().split('-')[0];
      const matchedLocale = i18n.locales.find(
        (locale) =>
          locale.toLowerCase() === lang.toLowerCase() || locale.toLowerCase() === shortLang
      );

      if (matchedLocale) return matchedLocale;
    }
  }
  return i18n.defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Check for auth token in cookies or headers
    const authHeader = request.headers.get('authorization');
    const token =
      extractTokenFromHeader(authHeader || undefined) || request.cookies.get('authToken')?.value;

    // If no token, redirect to home
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify token and check if user is admin
    const payload = verifyTokenEdge(token) as jwt.JwtPayload | null;
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow admin access
    return NextResponse.next();
  }

  // Skip locale handling for static files and API routes
  if (
    ['/manifest.json', '/favicon.ico', '/robots.txt', '/sitemap.xml'].includes(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/.netlify/') ||
    pathname.startsWith('/dictionaries/') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  // Handle locale routing
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Match everything except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image).*)', '/admin/:path*'],
};
