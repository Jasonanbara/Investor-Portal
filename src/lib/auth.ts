import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { authConfig } from "./auth.config";

/**
 * Full NextAuth config — extends the edge-safe authConfig with Credentials provider.
 * This file is only imported by API routes (not middleware/edge).
 */
const config = {
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("[Auth] Missing email or password");
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;
          console.log("[Auth] Attempting login for:", email.toLowerCase());

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!user) {
            console.log("[Auth] User not found:", email.toLowerCase());
            return null;
          }

          if (!user.isActive) {
            console.log("[Auth] User is inactive:", email.toLowerCase());
            return null;
          }

          const isValidPassword = await verifyPassword(
            password,
            user.passwordHash
          );

          if (!isValidPassword) {
            console.log("[Auth] Invalid password for:", email.toLowerCase());
            return null;
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          console.log("[Auth] Login successful for:", user.email, "role:", user.role);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Authorize error:", error);
          return null;
        }
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
