import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { User } from './interfaces/auth.interface';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value; // Correct way to access cookies in middleware

  console.log('Token:', token);
  console.log('Path:', path);

  // Redirect unauthenticated users from protected routes
  if (!token) {
    if (path === '/') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Redirect authenticated users from auth pages
  if (['/auth/login', '/auth/signup'].includes(path)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Validate token for protected routes
  if (path === '/' || path === '/auth/verification') {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-token`, {
        headers: {
          Cookie: `token=${token}`, // Use the actual token value
        },
      });

      if (!response.ok) throw new Error('Invalid token');

      const userData: User = await response.json();
      const responseHeaders = new Headers(request.headers);
      responseHeaders.set('x-logged-in-user', JSON.stringify(userData));

      if (path === '/auth/verification') {
        return userData.verified 
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();
      }

      return userData.verified
        ? NextResponse.next({ headers: responseHeaders })
        : NextResponse.redirect(new URL('/auth/verification', request.url));
    } catch (error) {
      console.error('Token verification failed:', error);
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token'); // Clear invalid token
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/auth/verification',
    '/auth/login',
    '/auth/signup',
  ],
};