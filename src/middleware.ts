import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/dashboard", "/deals", "/opportunities", "/reports", "/documents", "/messages", "/profile", "/settings", "/notifications", "/onboarding", "/admin"];
const publicPaths = ["/login", "/register", "/forgot-password", "/verify-email", "/two-factor", "/api/auth", "/api/health", "/api/webhooks"];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path));
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some((path) => pathname.startsWith(path));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Try both possible cookie names (NextAuth v5 uses "authjs", v4 uses "next-auth")
  let token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "__Secure-authjs.session-token",
  });

  // Fallback: try non-secure cookie name (for local dev or cookie name mismatch)
  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "authjs.session-token",
    });
  }

  // Fallback: try NextAuth v4 cookie names
  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "__Secure-next-auth.session-token",
    });
  }

  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token",
    });
  }

  // Last fallback: let getToken auto-detect
  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
  }

  const isLoggedIn = !!token;

  // Allow public paths
  if (isPublicPath(pathname)) {
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (isProtectedPath(pathname)) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin route protection
    if (pathname.startsWith("/admin")) {
      const role = token?.role as string | undefined;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "UNDERWRITER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
