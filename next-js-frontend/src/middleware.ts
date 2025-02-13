import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FetchUserInfoResponse } from "./lib/server/services/userService";
import { decrypt, SessionPayload } from "./lib/server/session";

const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
];
const protectedRoutes = [
  "/",
  "/auth/verification"
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  
  const cookie = req.cookies.get("token")?.value;
  
  if(!cookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  const session = await decrypt(cookie) as SessionPayload;
  
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user`,{headers:{"Cookie":`token=${cookie}`}})
    
    if(!res.ok && isProtectedRoute){
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    const userInfo = await res.json() as FetchUserInfoResponse;
    const isVerified = userInfo.emailVerified;
    
    
    if(!isVerified && isProtectedRoute && path !== '/auth/verification'){
      const response = NextResponse.redirect(new URL('/auth/verification', req.url));
      response.cookies.set("tempUserInfo",JSON.stringify(userInfo),{
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === 'production'
      })
      return response;
    }
    else if(!isVerified && isProtectedRoute && path === '/auth/verification'){
      const response = NextResponse.next();
      response.cookies.set("tempUserInfo",JSON.stringify(userInfo),{
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === 'production'
      })
      return response;
    }

  } catch (error) {
    console.log('error fetching user info in middleware',error);
  }

  if (isProtectedRoute && !session.userId) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isPublicRoute && session.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  const response = NextResponse.next();

  if (session.userId) {
    response.cookies.set("loggedInUserId", session.userId, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === 'production'
    });
  }
  
  return response;
}
