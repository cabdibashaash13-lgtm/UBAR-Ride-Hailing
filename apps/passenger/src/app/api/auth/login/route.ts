import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { passenger: true, city: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        photoUrl: user.photoUrl,
        role: user.role,
        city: user.city?.name,
        passengerId: user.passenger?.id,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
