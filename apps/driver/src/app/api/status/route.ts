import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { driverId, isOnline } = await request.json();
    if (!driverId) return NextResponse.json({ success: false, error: "driverId required" }, { status: 400 });

    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { isOnline },
    });

    return NextResponse.json({ success: true, data: { isOnline: driver.isOnline } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update status";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
