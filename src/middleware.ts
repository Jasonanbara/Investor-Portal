import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/dashboard", "/deals", "/opportunities", "/reports", "/documents", "/messages", "/profile", "/settings", "/notifications", "/onboarding", "/admin"];
const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/two-factor",
  "/api/auth",
  "/api/health",
  "/api/webhooks",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path));
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some((path) => pathname.startsWith(path));
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  // Allow public paths
  if (isPublicPath(pathname)) {
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      const response = NextResponse.redirect(new URL("/dashboard", req.url));
      return addSecurityHeaders(response);
    }
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Protect authenticated routes
  if (isProtectedPath(pathname)) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      return addSecurityHeaders(response);
    }

    // Admin route protection
    if (pathname.startsWith("/admin")) {
      const role = token?.role as string | undefined;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "UNDERWRITER") {
        const response = NextResponse.redirect(new URL("/dashboard", req.url));
        return addSecurityHeaders(response);
      }
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
