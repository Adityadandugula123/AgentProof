import { NextResponse } from "next/server";
import { verifyCooLEvidence } from "@/lib/cool";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { evidence } = await req.json();
    if (!evidence) {
      return NextResponse.json(
        { success: false, error: "Evidence object is required for verification." },
        { status: 400 }
      );
    }
    const verdict = await verifyCooLEvidence(evidence);
    return NextResponse.json({
      success: true,
      verdict,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to verify CooL evidence.",
      },
      { status: 500 }
    );
  }
}
