import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driver = await prisma.driver.update({
      where: { id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });

    // Also approve the verification document
    await prisma.verificationDocument.updateMany({
      where: { driverId: id },
      data: { status: "APPROVED", reviewedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: driver });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to approve driver";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
