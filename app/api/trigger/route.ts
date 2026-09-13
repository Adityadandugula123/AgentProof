import { NextResponse } from "next/server";
import { runRefundAgentScenario } from "@/lib/cool";
import { createHash } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let agentName = "";
    let action = "";
    let eventType = "";
    let amount = "";
    let currency = "";
    let recipientId = "";
    let reason = "";
    let inputPayload = "";
    let outputPayload = "";
    let attachedFileMeta: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      agentName = (formData.get("agentName") as string) || "";
      action = (formData.get("action") as string) || "";
      eventType = (formData.get("eventType") as string) || "";
      amount = (formData.get("amount") as string) || "";
      currency = (formData.get("currency") as string) || "";
      recipientId = (formData.get("recipientId") as string) || "";
      reason = (formData.get("reason") as string) || "";
      inputPayload = (formData.get("inputPayload") as string) || "";
      outputPayload = (formData.get("outputPayload") as string) || "";

      const file = formData.get("file") as File | null;
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileHash = createHash("sha256").update(buffer).digest("hex");
        const multihash = `mh:sha256:${fileHash}`;

        attachedFileMeta = `Attached File: ${file.name} (${file.size} bytes, ${file.type || "binary"}) | Multihash: ${multihash}`;
        inputPayload = `${inputPayload} | [${attachedFileMeta}]`;
        outputPayload = `${outputPayload} | [Verified File Multihash: ${multihash}]`;
      }
    } else {
      const body = await req.json().catch(() => ({}));
      agentName = body.agentName;
      action = body.action;
      eventType = body.eventType;
      amount = body.amount;
      currency = body.currency;
      recipientId = body.recipientId;
      reason = body.reason;
      inputPayload = body.inputPayload;
      outputPayload = body.outputPayload;
    }

    const result = await runRefundAgentScenario({
      agentName,
      action,
      eventType,
      amount,
      currency,
      recipientId,
      reason,
      inputPayload,
      outputPayload,
    });

    return NextResponse.json({
      success: true,
      data: result,
      attachedFileMeta,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to execute refund agent scenario and create evidence.",
      },
      { status: 500 }
    );
  }
}
