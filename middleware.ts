import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define supported locales
const locales = ['en', 'ka'];
const defaultLocale = 'en';

// Get the preferred locale from request headers
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator to get client's preferred locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Match preferred locale against supported locales
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // Get pathname
  const { pathname } = request.nextUrl;

  // Check if pathname has a supported locale
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
    // Skip all internal paths (_next) and static assets
    '/((?!_next|.*\\..*).*)',
  ],
};
