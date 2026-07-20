import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where = search
      ? { OR: [{ fullName: { contains: search, mode: "insensitive" as const } }, { phone: { contains: search } }] }
      : {};

    const [passengers, total] = await Promise.all([
      prisma.user.findMany({
        where: { ...where, role: "PASSENGER" },
        include: { passenger: { include: { _count: { select: { trips: true } } } }, city: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where: { ...where, role: "PASSENGER" } }),
    ]);

   const formatted = passengers.map((p: any) => ({
      id: p.id,
      fullName: p.fullName,
      phone: p.phone,
      createdAt: p.createdAt.toISOString(),
      totalTrips: p.passenger?._count?.trips || 0,
    }));

    return NextResponse.json({
      success: true, data: formatted, total, page, pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch passengers";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
