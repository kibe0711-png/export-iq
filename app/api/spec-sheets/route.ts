import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Papa from "papaparse";

export async function GET() {
  try {
    const sheets = await prisma.specSheet.findMany({
      orderBy: [{ customerCode: "asc" }, { crop: "asc" }],
    });
    return NextResponse.json(sheets);
  } catch (error) {
    console.error("Failed to fetch spec sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch spec sheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const replaceAll = formData.get("replaceAll") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();

    const parseResult = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) =>
        header.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: "CSV parsing error", details: parseResult.errors },
        { status: 400 }
      );
    }

    const sheets = parseResult.data.map((row) => ({
      customerCode: String(row.customer_code || "").trim(),
      crop: String(row.crop || "").trim(),
      packagingType: String(row.type || row.packaging_type || "").trim(),
      palletWeight: parseFloat(String(row.pallet_weight || "0")) || 0,
      price: parseFloat(String(row.price || "0")) || 0,
    }));

    const validSheets = sheets.filter(
      (sheet) => sheet.customerCode && sheet.crop
    );

    if (validSheets.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid rows found. Required columns: customer_code, crop, type, pallet_weight, price",
        },
        { status: 400 }
      );
    }

    if (replaceAll) {
      await prisma.specSheet.deleteMany();
    }

    const inserted = await prisma.specSheet.createMany({
      data: validSheets,
    });

    return NextResponse.json({
      success: true,
      inserted: inserted.count,
      total: parseResult.data.length,
      skipped: parseResult.data.length - validSheets.length,
    });
  } catch (error) {
    console.error("Failed to upload spec sheets:", error);
    return NextResponse.json(
      { error: "Failed to upload spec sheets" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.specSheet.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear spec sheets:", error);
    return NextResponse.json(
      { error: "Failed to clear spec sheets" },
      { status: 500 }
    );
  }
}
