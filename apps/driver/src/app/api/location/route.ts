import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { driverId, lat, lng } = await request.json();
    if (!driverId || lat == null || lng == null) {
      return NextResponse.json({ success: false, error: "driverId, lat, lng required" }, { status: 400 });
    }

    await prisma.driver.update({
      where: { id: driverId },
      data: { currentLat: lat, currentLng: lng },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update location";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
