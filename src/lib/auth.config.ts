import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config (no Prisma, no Node.js-only imports).
 * Used by middleware to verify JWT tokens without importing Prisma.
 */

type Role = "SUPER_ADMIN" | "ADMIN" | "UNDERWRITER" | "INVESTOR";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      image?: string | null;
    };
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 86400, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Providers added in auth.ts (not needed for middleware JWT verification)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public paths — always allow
      const publicPaths = ["/login", "/register", "/forgot-password", "/verify-email", "/two-factor"];
      if (publicPaths.some((p) => pathname.startsWith(p))) {
        // Redirect logged-in users away from auth pages
        if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // API routes — let them handle their own auth
      if (pathname.startsWith("/api")) {
        return true;
      }

      // Protected paths
      const protectedPaths = ["/dashboard", "/deals", "/opportunities", "/reports", "/documents", "/messages", "/profile", "/settings", "/notifications", "/onboarding", "/admin"];
      const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

      if (isProtected && !isLoggedIn) {
        return false; // NextAuth redirects to signIn page
      }

      // Admin route protection
      if (pathname.startsWith("/admin") && isLoggedIn) {
        const role = auth?.user?.role;
        if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "UNDERWRITER") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }

      return true;
    },
  },
};
