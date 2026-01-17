import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only enforce HTTPS in production to avoid local development issues
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host') || request.nextUrl.host;

    // Skip HTTPS enforcement on localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return NextResponse.next();
    }

    // Check the protocol from the x-forwarded-proto header (standard for proxies/load balancers)
    // or fallback to the URL protocol
    const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol;

    // If the protocol is explicitly http (and not https), redirect
    // Note: proto might contain 'http:' or just 'http' depending on the source
    if (proto.includes('http') && !proto.includes('https')) {
      return NextResponse.redirect(
        `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
        301
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
