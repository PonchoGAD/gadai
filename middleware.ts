import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore internal files and non-localized standalone pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/pay') ||  // pay page lives at /pay, not /[locale]/pay
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // If already has locale, continue
  if (pathname.startsWith('/en') || pathname.startsWith('/ru')) {
    return;
  }

  // Redirect root and all non-locale paths
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
