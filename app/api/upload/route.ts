import { NextResponse } from "next/server";
import { recordDocumentEvidence } from "@/lib/cool";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const notes = (formData.get("notes") as string) || "";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await recordDocumentEvidence(buffer, file.name, file.type || "application/octet-stream", notes);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to process uploaded file and generate cryptographic evidence.",
      },
      { status: 500 }
    );
  }
}
