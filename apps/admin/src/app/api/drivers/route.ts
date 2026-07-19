import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search } } },
        { vehicle: { plateNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        include: {
          user: { select: { fullName: true, phone: true, photoUrl: true } },
          vehicle: true,
          verificationDocument: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.driver.count({ where }),
    ]);

    const formatted = drivers.map((d) => ({
      id: d.id,
      fullName: d.user.fullName,
      phone: d.user.phone,
      status: d.status,
      vehicleType: d.vehicle?.type || "BAJAJ",
      plateNumber: d.vehicle?.plateNumber || "",
      rating: d.rating,
      totalTrips: d.totalTrips,
      createdAt: d.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true, data: formatted, total, page, pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch drivers";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
