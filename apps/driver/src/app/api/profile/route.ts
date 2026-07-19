import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const driverId = req.nextUrl.searchParams.get("driverId");
    if (!driverId) return NextResponse.json({ success: false, error: "driverId required" }, { status: 400 });

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: true,
        vehicle: true,
        verificationDocument: true,
      },
    });

    if (!driver) return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      data: {
        id: driver.id,
        fullName: driver.user.fullName,
        phone: driver.user.phone,
        photoUrl: driver.user.photoUrl,
        status: driver.status,
        isOnline: driver.isOnline,
        rating: driver.rating,
        totalTrips: driver.totalTrips,
        totalEarnings: driver.totalEarnings,
        vehicle: driver.vehicle ? {
          type: driver.vehicle.type,
          plateNumber: driver.vehicle.plateNumber,
          model: driver.vehicle.model,
          color: driver.vehicle.color,
          year: driver.vehicle.year,
        } : null,
        document: driver.verificationDocument ? {
          type: driver.verificationDocument.documentType,
          number: driver.verificationDocument.documentNumber,
          status: driver.verificationDocument.status,
        } : null,
        createdAt: driver.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Driver profile error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { driverId, fullName, phone, photoUrl } = body;
    if (!driverId) return NextResponse.json({ success: false, error: "driverId required" }, { status: 400 });

    const driver = await prisma.driver.findUnique({ where: { id: driverId }, include: { user: true } });
    if (!driver) return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 });

    await prisma.user.update({
      where: { id: driver.userId },
      data: { fullName: fullName ?? driver.user.fullName, phone: phone ?? driver.user.phone, photoUrl: photoUrl ?? driver.user.photoUrl },
    });

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("Update driver profile error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
