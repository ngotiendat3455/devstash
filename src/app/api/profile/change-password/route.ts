import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validation/profile";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = await changePasswordSchema.parseAsync(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
      },
    });

    if (!user?.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Password changes are not available for this account.",
        },
        { status: 403 },
      );
    }

    const isValidPassword = await compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Current password is incorrect.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message ?? "Invalid password details.",
        },
        { status: 400 },
      );
    }

    console.error("Changing password failed.", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to change password right now.",
      },
      { status: 500 },
    );
  }
}
