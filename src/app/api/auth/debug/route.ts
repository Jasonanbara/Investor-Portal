import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count();

    // List users (email + role only, no sensitive data)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        passwordHash: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    // Check environment
    const hasSecret = !!process.env.NEXTAUTH_SECRET;
    const hasDbUrl = !!process.env.DATABASE_URL;
    const nextAuthUrl = process.env.NEXTAUTH_URL || "(not set)";

    // Check all possible cookie names
    const cookieNames = [
      "__Secure-authjs.session-token",
      "authjs.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.session-token",
    ];

    const cookiesFound: Record<string, boolean> = {};
    for (const name of cookieNames) {
      cookiesFound[name] = !!request.cookies.get(name);
    }

    // List all cookies (names only, not values)
    const allCookieNames = request.cookies.getAll().map(c => c.name);

    // Try getToken with different cookie names
    const tokenResults: Record<string, string> = {};
    for (const cookieName of cookieNames) {
      try {
        const t = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, cookieName });
        tokenResults[cookieName] = t ? "VALID (id: " + (t.id || t.sub || "unknown") + ")" : "null";
      } catch (e) {
        tokenResults[cookieName] = "ERROR: " + (e instanceof Error ? e.message : String(e));
      }
    }

    // Try auto-detect
    try {
      const autoToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      tokenResults["auto-detect"] = autoToken ? "VALID" : "null";
    } catch (e) {
      tokenResults["auto-detect"] = "ERROR: " + (e instanceof Error ? e.message : String(e));
    }

    return NextResponse.json({
      status: "ok",
      cookies: {
        found: cookiesFound,
        allNames: allCookieNames,
      },
      tokenResults,
      database: {
        connected: true,
        userCount,
      },
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        isActive: u.isActive,
        hasPasswordHash: !!u.passwordHash && u.passwordHash.length > 0,
        passwordHashPrefix: u.passwordHash ? u.passwordHash.substring(0, 7) : "none",
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
      })),
      env: {
        NEXTAUTH_SECRET: hasSecret ? "set" : "MISSING",
        DATABASE_URL: hasDbUrl ? "set" : "MISSING",
        NEXTAUTH_URL: nextAuthUrl,
        NODE_ENV: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
