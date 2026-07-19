import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();
    const driver = await prisma.driver.update({
      where: { id },
      data: { status: "REJECTED", rejectedAt: new Date(), rejectionNote: reason },
    });
    await prisma.verificationDocument.updateMany({
      where: { driverId: id },
      data: { status: "REJECTED", reviewedAt: new Date(), notes: reason },
    });
    return NextResponse.json({ success: true, data: driver });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reject driver";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
