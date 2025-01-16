import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from './interfaces/auth.interface';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  if(!token && ['/auth/login','auth/signup'].includes(path)){
    return NextResponse.next();
  } 

  if(!token && ['/'].includes(path)){
    // if user is not logged in and trying to access home page, redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if(token && ['/auth/login','/auth/signup'].includes(path)){
    // if user is logged in and trying to access login or signup page, redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(token && ['/auth/verification'].includes(path)){
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/auth/verify-token',{
      headers: {
        'Cookie':`token=${token}`
      }
    })
    const userData: User = await response.json();
    if(userData.verified){
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  if(token && ['/'].includes(path)){
    // if user is logged in and trying to access home-page
    // then verify the token and redirect to login page if token is invalid
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/auth/verify-token',{
      headers: {
        'Cookie':`token=${token}`
      }
    })

    if(response.ok){
      // if the token is valid
      // then get the user data and set it in the header
      // so that it can be used in page components ahead
      const userData: User = await response.json();

      if(userData.verified){
        const nextResponse = NextResponse.next();
        nextResponse.headers.set('x-logged-in-user', JSON.stringify(userData));
        return nextResponse;
      }
      else{
        return NextResponse.redirect(new URL('/auth/verification', request.url)) 
      }
    }
    else{
      // if token is invalid, redirect to login page
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }


  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/','/auth/verification']
}