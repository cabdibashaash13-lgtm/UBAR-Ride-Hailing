import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        role: "PASSENGER",
        passenger: { create: {} },
      },
      include: { passenger: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
