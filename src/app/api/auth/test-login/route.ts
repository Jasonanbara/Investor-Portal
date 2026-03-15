import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        step: "user_lookup",
        found: false,
        message: "No user found with this email",
      });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    return NextResponse.json({
      step: "password_verify",
      userFound: true,
      userEmail: user.email,
      isActive: user.isActive,
      passwordValid: isValid,
      role: user.role,
      hashPrefix: user.passwordHash.substring(0, 7),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
