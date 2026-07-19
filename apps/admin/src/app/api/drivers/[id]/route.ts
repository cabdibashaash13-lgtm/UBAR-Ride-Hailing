import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const driver = await prisma.driver.findUnique({
      where: { id },
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
          photoUrl: driver.verificationDocument.photoUrl,
          status: driver.verificationDocument.status,
          notes: driver.verificationDocument.notes,
        } : null,
        createdAt: driver.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin driver detail error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch driver" }, { status: 500 });
  }
}
