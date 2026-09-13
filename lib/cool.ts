import { CooL, verifyEvidence, type Evidence, type Verdict } from "cool-nwc";
import { createHash } from "crypto";

let coolInstance: CooL | null = null;

function getCooLInstance(): CooL {
  if (!coolInstance) {
    coolInstance = new CooL({
      applicationId: "agentproof-document-suite",
    });
  }
  return coolInstance;
}

export interface AgentRunParams {
  agentName: string;
  action: string;
  eventType: string;
  amount: string;
  currency: string;
  recipientId: string;
  reason: string;
  inputPayload: string;
  outputPayload: string;
  executionId?: string;
}

export interface AgentRunResult {
  agentDetails: {
    agentName: string;
    action: string;
    eventType: string;
    amount: string;
    currency: string;
    recipientId: string;
    reason: string;
    inputPayload: string;
    outputPayload: string;
    status: "SUCCESS" | "FAILED";
    timestamp: string;
  };
  evidence: Evidence;
  recordId: string;
  executionId: string;
  bindingHash: string;
  runtime: {
    vendor: string;
    mode: string;
  };
  verdict: Verdict;
}

export interface DocumentEvidenceResult {
  fileDetails: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    sha256Hash: string;
    timestamp: string;
    notes: string;
  };
  evidence: Evidence;
  recordId: string;
  executionId: string;
  bindingHash: string;
  runtime: {
    vendor: string;
    mode: string;
  };
  verdict: Verdict;
}

/**
 * Execute the AI Refund Agent action with custom user parameters and generate real cryptographic evidence via CooL.
 */
export async function runRefundAgentScenario(params?: Partial<AgentRunParams>): Promise<AgentRunResult> {
  const cool = getCooLInstance();

  const agentName = params?.agentName?.trim() || "AI Refund Agent";
  const action = params?.action?.trim() || "issue_refund";
  const eventType = params?.eventType?.trim() || "agent.action.refund";
  const amount = params?.amount?.trim() || "₹4,500";
  const currency = params?.currency?.trim() || "INR";
  const recipientId = params?.recipientId?.trim() || "CUST-84920";
  const reason = params?.reason?.trim() || "Duplicate subscription payment resolution";
  const inputPayload = params?.inputPayload?.trim() || `Customer ${recipientId} refund request for ${amount} ${currency}: ${reason}`;
  const outputPayload = params?.outputPayload?.trim() || `Approved refund of ${amount} ${currency} to account connected with ${recipientId}`;
  const timestamp = new Date().toISOString();

  // Create real evidence via CooL SDK record() API
  const recordResult = await cool.record({
    type: eventType,
    metadata: {
      agent: agentName,
      action: action,
      amount: amount,
      currency: currency,
      recipient_id: recipientId,
      reason: reason,
      software: "AgentProof Refund Suite v1.0",
      environment: "production-simulated",
    },
    payloads: {
      input: inputPayload,
      output: outputPayload,
    },
    software: {
      name: "AgentProof",
      version: "1.0.0",
      digest: null,
    },
  });

  // Ensure RFC 6962 STH / Merkle inclusion log processes
  await cool.ready();

  const evidence = recordResult.evidence;
  const initialVerdict = await verifyEvidence(evidence);

  return {
    agentDetails: {
      agentName,
      action,
      eventType,
      amount,
      currency,
      recipientId,
      reason,
      inputPayload,
      outputPayload,
      status: "SUCCESS",
      timestamp,
    },
    evidence,
    recordId: recordResult.recordId,
    executionId: recordResult.executionId,
    bindingHash: recordResult.digest,
    runtime: {
      vendor: cool.environment.vendor || "intel-tdx",
      mode: cool.environment.mode || "simulated",
    },
    verdict: initialVerdict,
  };
}

/**
 * Record real cryptographic evidence for an uploaded document or file buffer.
 */
export async function recordDocumentEvidence(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  notes?: string
): Promise<DocumentEvidenceResult> {
  const cool = getCooLInstance();

  // Compute exact SHA-256 multihash digest of the uploaded file bytes
  const fileHash = createHash("sha256").update(fileBuffer).digest("hex");
  const multihash = `mh:sha256:${fileHash}`;
  const timestamp = new Date().toISOString();
  const fileSize = fileBuffer.length;
  const noteText = notes?.trim() || "Uploaded document cryptographic verification receipt";

  // Create CooL evidence for the uploaded document
  const recordResult = await cool.record({
    type: "artifact.document.upload",
    metadata: {
      file_name: fileName,
      file_size_bytes: String(fileSize),
      mime_type: mimeType,
      file_sha256: fileHash,
      notes: noteText,
      software: "AgentProof Document Vault v1.0",
      environment: "production-simulated",
    },
    payloads: {
      input: `Uploaded file: ${fileName} (${fileSize} bytes, ${mimeType})`,
      output: `Document SHA-256 Multihash Digest: ${multihash}`,
    },
    software: {
      name: "AgentProof Document Engine",
      version: "1.0.0",
      digest: null,
    },
  });

  await cool.ready();

  const evidence = recordResult.evidence;
  const verdict = await verifyEvidence(evidence);

  return {
    fileDetails: {
      fileName,
      fileSize,
      mimeType,
      sha256Hash: fileHash,
      timestamp,
      notes: noteText,
    },
    evidence,
    recordId: recordResult.recordId,
    executionId: recordResult.executionId,
    bindingHash: recordResult.digest,
    runtime: {
      vendor: cool.environment.vendor || "intel-tdx",
      mode: cool.environment.mode || "simulated",
    },
    verdict,
  };
}

/**
 * Run standalone CooL evidence verification.
 */
export async function verifyCooLEvidence(evidence: Evidence): Promise<Verdict> {
  return await verifyEvidence(evidence);
}

/**
 * Perform a real cryptographic tamper action on CooL evidence and verify it again.
 */
export async function tamperAndVerifyCooLEvidence(
  originalEvidence: Evidence,
  tamperField: "metadata_hash" | "amount" | "commitments" = "metadata_hash",
  customTamperValue?: string
): Promise<{
  tamperedEvidence: Evidence;
  tamperDescription: string;
  originalValue: string;
  tamperedValue: string;
  verdict: Verdict;
}> {
  const clonedEvidence = JSON.parse(JSON.stringify(originalEvidence)) as Evidence;
  const recordAny = clonedEvidence.record as any;

  let originalValue = "";
  let tamperedValue = "";
  let tamperDescription = "";

  if (tamperField === "metadata_hash" || tamperField === "amount") {
    const eventObj = recordAny.event;
    originalValue = eventObj.metadata_hash;

    const modifiedHash = eventObj.metadata_hash.replace(/.$/, (char: string) => (char === "0" ? "1" : "0"));
    recordAny.event.metadata_hash = modifiedHash;

    tamperedValue = modifiedHash;
    tamperDescription = customTamperValue
      ? `Altered metadata commitment (simulating file edit or hash modification to ${customTamperValue})`
      : "Altered metadata commitment hash (simulating unauthorized file edit)";
  } else if (tamperField === "commitments") {
    const commitments = recordAny.event?.commitments;
    if (commitments && commitments.input) {
      originalValue = commitments.input;
      const modifiedInput = commitments.input.replace(/.$/, (char: string) => (char === "a" ? "b" : "a"));
      recordAny.event.commitments.input = modifiedInput;
      tamperedValue = modifiedInput;
      tamperDescription = "Modified input payload commitment hash";
    }
  }

  const verdict = await verifyEvidence(clonedEvidence);

  return {
    tamperedEvidence: clonedEvidence,
    tamperDescription,
    originalValue,
    tamperedValue,
    verdict,
  };
}
