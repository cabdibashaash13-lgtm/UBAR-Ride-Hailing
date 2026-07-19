import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "5");
    const vehicleType = searchParams.get("vehicleType");

    const drivers = await prisma.driver.findMany({
      where: {
        status: "APPROVED",
        isOnline: true,
        currentLat: { not: null },
        currentLng: { not: null },
        ...(vehicleType ? { vehicle: { type: vehicleType as "BAJAJ" | "MOTORCYCLE" } } : {}),
      },
      include: {
        user: { select: { fullName: true, photoUrl: true, phone: true } },
        vehicle: true,
      },
    });

    // Calculate distance and filter by radius
    const R = 6371;
    const nearby = drivers
      .map((driver) => {
        const dLat = ((driver.currentLat! - lat) * Math.PI) / 180;
        const dLng = ((driver.currentLng! - lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((driver.currentLat! * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return { ...driver, distanceKm: Math.round(distance * 100) / 100 };
      })
      .filter((d) => d.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({ success: true, data: nearby });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to find drivers";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
