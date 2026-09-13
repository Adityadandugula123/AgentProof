import { NextResponse } from "next/server";
import { tamperAndVerifyCooLEvidence } from "@/lib/cool";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const startTime = performance.now();
  try {
    const { evidence, tamperField = "metadata_hash" } = await req.json();
    if (!evidence) {
      return NextResponse.json(
        { success: false, error: "Evidence object is required for tamper testing." },
        { status: 400 }
      );
    }
    const tamperResult = await tamperAndVerifyCooLEvidence(evidence, tamperField);
    const durationMs = Math.round(performance.now() - startTime);
    return NextResponse.json({
      success: true,
      data: tamperResult,
      durationMs,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to tamper and re-verify evidence.",
      },
      { status: 500 }
    );
  }
}
