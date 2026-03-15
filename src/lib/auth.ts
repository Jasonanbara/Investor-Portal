import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

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

const config: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 900, // 15 minutes
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
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
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        const role = auth?.user?.role;
        if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        return true;
      }

      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
