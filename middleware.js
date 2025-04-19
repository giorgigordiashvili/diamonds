import { NextResponse } from 'next/server';

// Define supported locales
export const locales = ['en', 'ka'];
export const defaultLocale = 'en';

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

export function middleware(request) {
  // Get pathname
  const pathname = request.nextUrl.pathname;

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
    // Skip all internal paths (_next) and files with extensions
    '/((?!_next|.*\\..*).*)',
  ],
};
