import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt, deleteSession, SessionPayload } from "./lib/server/session";

const publicRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
];
const protectedRoutes = ["/"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("token")?.value;

  if (!cookie) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    } else {
      return NextResponse.next();
    }
  }

  const session = await decrypt(cookie) as SessionPayload;

  if (!session) {
    await deleteSession();
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    } else {
      return NextResponse.next();
    }
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

  // const {userId} = session;

  // if(!user.emailVerified && path!='/auth/verification'){
  //   return NextResponse.redirect(new URL('/auth/verification', req.url));
  // }

  if (isProtectedRoute && !session.userId) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isPublicRoute && session.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  console.log('coming heree');
  return response;
}
