import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ success: false, error: "Phone required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { driver: { include: { vehicle: true, verificationDocument: true } } },
    });

    if (!user || user.role !== "DRIVER") {
      return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 });
    }

    if (user.driver?.status !== "APPROVED") {
      return NextResponse.json({ success: false, error: `Driver status: ${user.driver?.status}` }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id, driverId: user.driver.id, fullName: user.fullName,
        phone: user.phone, photoUrl: user.photoUrl, vehicle: user.driver.vehicle,
        rating: user.driver.rating, isOnline: user.driver.isOnline,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
