import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // Role-based route authorization
    if (pathname.startsWith('/platform')) {
      if (role !== 'PLATFORM_ADMIN') {
        return NextResponse.redirect(new URL('/login?error=UnauthorizedPlatform', req.url));
      }
    }

    if (pathname.startsWith('/admin')) {
      if (role !== 'SCHOOL_ADMIN' && role !== 'PLATFORM_ADMIN') {
        return NextResponse.redirect(new URL('/login?error=UnauthorizedAdmin', req.url));
      }
    }

    if (pathname.startsWith('/teacher')) {
      if (role !== 'TEACHER') {
        return NextResponse.redirect(new URL('/login?error=UnauthorizedTeacher', req.url));
      }
    }

    if (pathname.startsWith('/parent')) {
      if (role !== 'PARENT') {
        return NextResponse.redirect(new URL('/login?error=UnauthorizedParent', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Public routes
        if (
          pathname === '/' ||
          pathname === '/pricing' ||
          pathname.startsWith('/login') ||
          pathname.startsWith('/register') ||
          pathname.startsWith('/forgot-password') ||
          pathname.startsWith('/reset-password') ||
          pathname.startsWith('/accept-invite') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/webhooks')
        ) {
          return true;
        }

        // Protected routes require valid JWT token
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/platform/:path*', '/admin/:path*', '/teacher/:path*', '/parent/:path*'],
};
