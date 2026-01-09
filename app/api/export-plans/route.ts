import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekStartParam = searchParams.get("weekStart");

    if (!weekStartParam) {
      return NextResponse.json(
        { error: "weekStart parameter is required" },
        { status: 400 }
      );
    }

    const weekStart = getMonday(new Date(weekStartParam));

    const plans = await prisma.exportPlan.findMany({
      where: {
        weekStart: weekStart,
      },
      orderBy: [{ customerCode: "asc" }, { crop: "asc" }],
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch export plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch export plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      weekStart,
      customerCode,
      cropCode,
      crop,
      packagingType,
      quantity,
      palletWeight,
      unitWeight,
      price,
      totalWeight,
      unitCount,
      revenue,
    } = body;

    if (!weekStart || !customerCode || !crop || !packagingType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const monday = getMonday(new Date(weekStart));

    const plan = await prisma.exportPlan.create({
      data: {
        weekStart: monday,
        customerCode,
        cropCode: cropCode || "",
        crop,
        packagingType,
        quantity: parseInt(quantity),
        palletWeight: parseFloat(palletWeight),
        unitWeight: parseFloat(unitWeight),
        price: parseFloat(price),
        totalWeight: parseFloat(totalWeight),
        unitCount: parseFloat(unitCount),
        revenue: parseFloat(revenue),
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to create export plan:", error);
    return NextResponse.json(
      { error: "Failed to create export plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 }
      );
    }

    await prisma.exportPlan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete export plan:", error);
    return NextResponse.json(
      { error: "Failed to delete export plan" },
      { status: 500 }
    );
  }
}
