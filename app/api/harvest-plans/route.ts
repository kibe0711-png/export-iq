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

    const plans = await prisma.harvestPlan.findMany({
      where: {
        weekStart: weekStart,
      },
      orderBy: [{ crop: "asc" }],
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch harvest plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch harvest plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekStart, cropCode, crop, kgs } = body;

    if (!weekStart || !cropCode || !crop) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const monday = getMonday(new Date(weekStart));

    const plan = await prisma.harvestPlan.create({
      data: {
        weekStart: monday,
        cropCode,
        crop,
        kgs: parseFloat(kgs) || 0,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Failed to create harvest plan:", error);
    return NextResponse.json(
      { error: "Failed to create harvest plan" },
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

    await prisma.harvestPlan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete harvest plan:", error);
    return NextResponse.json(
      { error: "Failed to delete harvest plan" },
      { status: 500 }
    );
  }
}
