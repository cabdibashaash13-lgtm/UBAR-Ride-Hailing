import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tripId, passengerId, method, currency = "USD", reference } = body;

    if (!tripId || !passengerId || !method) {
      return NextResponse.json(
        { success: false, error: "tripId, passengerId, and method are required" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        tripId,
        passengerId,
        method,
        amount: trip.fare || 0,
        currency,
        status: method === "CASH" ? "COMPLETED" : "PENDING",
        reference,
        paidAt: method === "CASH" ? new Date() : null,
      },
    });

    // Update trip status to completed if cash payment
    if (method === "CASH") {
      await prisma.trip.update({
        where: { id: tripId },
        data: { status: "COMPLETED", completedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, data: payment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
