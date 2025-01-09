import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  let token = request.cookies.get('token')?.value;

  if(!token && ['/'].includes(request.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if(token && ['/auth/login','/auth/signup'].includes(request.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/','/auth/login','/auth/signup']
}