import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName, phone, photoUrl, vehicleType, plateNumber,
      vehicleModel, vehicleColor, vehicleYear,
      documentType, documentNumber, documentPhotoUrl,
    } = body;

    if (!fullName || !phone || !vehicleType || !plateNumber || !documentType || !documentNumber || !documentPhotoUrl) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Phone already registered" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        photoUrl,
        role: "DRIVER",
        driver: {
          create: {
            status: "PENDING",
            vehicle: {
              create: {
                type: vehicleType,
                plateNumber,
                model: vehicleModel,
                color: vehicleColor,
                year: vehicleYear ? parseInt(vehicleYear) : null,
              },
            },
            verificationDocument: {
              create: {
                documentType,
                documentNumber,
                photoUrl: documentPhotoUrl,
                status: "PENDING",
              },
            },
          },
        },
      },
      include: { driver: { include: { vehicle: true, verificationDocument: true } } },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
