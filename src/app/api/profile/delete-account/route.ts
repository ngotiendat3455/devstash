import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAccountSchema } from "@/lib/validation/profile";

export async function DELETE(request: Request) {
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
    await deleteAccountSchema.parseAsync(body);

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message ?? "Deletion confirmation is invalid.",
        },
        { status: 400 },
      );
    }

    console.error("Deleting account failed.", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete your account right now.",
      },
      { status: 500 },
    );
  }
}
