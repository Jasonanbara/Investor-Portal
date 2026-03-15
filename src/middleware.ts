import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware using NextAuth's built-in auth — edge-safe (no Prisma).
 * Route protection logic is in authConfig.callbacks.authorized.
 * This ensures the same JWT/cookie handling as the sign-in flow.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
