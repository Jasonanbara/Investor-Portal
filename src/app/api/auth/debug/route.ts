import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    return NextResponse.json({
      status: "ok",
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
