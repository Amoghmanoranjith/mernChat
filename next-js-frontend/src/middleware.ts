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
  "/auth/verification",
];

// Exclude Next.js static files and internal paths
const ignoredPaths = ["/_next", "/favicon.ico", "/api"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Ignore Next.js assets & API routes
  if (ignoredPaths.some((ignored) => path.startsWith(ignored))) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("token")?.value;

  // If no token and it's a protected route, redirect to login
  if (!cookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Decrypt session from token
  const session = cookie ? (await decrypt(cookie) as SessionPayload) : null;

  // If session is invalid, redirect for protected routes
  if (!session?.userId && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  let userInfo: FetchUserInfoResponse | null = null;

  // Only fetch user info if necessary
  if (isProtectedRoute && session?.userId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user`, {
        headers: { "Cookie": `token=${cookie}` },
      });

      if (res.ok) {
        userInfo = await res.json() as FetchUserInfoResponse;
      } else {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    } catch (error) {
      console.error("Error fetching user info in middleware:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Redirect unverified users to verification page (unless already there)
  if (userInfo && !userInfo.emailVerified && path !== "/auth/verification") {
    const response = NextResponse.redirect(new URL("/auth/verification", req.url));
    response.cookies.set("tempUserInfo", JSON.stringify(userInfo), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  // If user is already on verification, just set the temp cookie
  if (userInfo && !userInfo.emailVerified && path === "/auth/verification") {
    const response = NextResponse.next();
    response.cookies.set("tempUserInfo", JSON.stringify(userInfo), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  // Redirect logged-in users away from public routes
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  const response = NextResponse.next();

  // Store userId in a cookie to avoid unnecessary decryption
  if (session?.userId) {
    response.cookies.set("loggedInUserId", session.userId, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  response.headers.set("Cookie", `token=${cookie}`);

  return response;
}
