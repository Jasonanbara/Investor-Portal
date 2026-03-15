import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();

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
