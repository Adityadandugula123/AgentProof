"use client";

import React, { useState } from "react";
import { FileCheck2, Shield, Lock, Copy, Check, Code, Eye, Sparkles } from "lucide-react";
import type { AgentRunResult } from "@/lib/cool";

interface EvidenceReceiptSectionProps {
  agentResult: AgentRunResult | null;
  onGoToVerify: () => void;
  onGoToRun: () => void;
}

export const EvidenceReceiptSection: React.FC<EvidenceReceiptSectionProps> = ({
  agentResult,
  onGoToVerify,
  onGoToRun,
}) => {
  const [activeTab, setActiveTab] = useState<"human" | "technical" | "raw">("human");
  const [copied, setCopied] = useState(false);

  if (!agentResult) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-slate-400 w-fit mx-auto">
          <FileCheck2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Evidence Created Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Run the Refund Agent first to generate your evidence receipt.
        </p>
        <button
          onClick={onGoToRun}
          className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-lg transition-all"
        >
          Run Refund Agent
        </button>
      </div>
    );
  }

  const { evidence, recordId, executionId, agentDetails, bindingHash } = agentResult;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(evidence, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* JUDGE STEP BANNER */}
      <div className="p-4 rounded-2xl bg-primary-600/10 border border-primary-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-600 text-white font-bold text-xs font-mono">
            STEP 2 OF 4
          </div>
          <div>
            <h3 className="font-bold text-sm">Inspect Verifiable Evidence Receipt</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CooL creates a self-contained receipt. Sensitive values are stored as salted hashes to preserve privacy.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToVerify}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Shield className="w-4 h-4" />
          <span>Proceed to Step 3: Verify</span>
        </button>
      </div>

      {/* Level Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-surface p-1 rounded-xl border border-slate-200 dark:border-surface-border w-fit font-mono text-xs">
        <button
          onClick={() => setActiveTab("human")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === "human"
              ? "bg-white dark:bg-surface-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-surface-border"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Human View</span>
        </button>

        <button
          onClick={() => setActiveTab("technical")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === "technical"
              ? "bg-white dark:bg-surface-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-surface-border"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Technical Parameters</span>
        </button>

        <button
          onClick={() => setActiveTab("raw")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === "raw"
              ? "bg-white dark:bg-surface-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-surface-border"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Code className="w-3.5 h-3.5 text-cyan-500" />
          <span>Raw JSON Receipt</span>
        </button>
      </div>

      {/* TAB 1: Human View */}
      {activeTab === "human" && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-surface-border pb-4">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">VERIFIED EVIDENCE RECEIPT</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Schema: cool.receipt.v2</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                Verified ✓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Event Type</span>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm truncate">{agentDetails.eventType}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">AI Agent Name</span>
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{agentDetails.agentName}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Action</span>
                <p className="text-slate-900 dark:text-white font-bold text-sm">{agentDetails.action.toUpperCase()}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Action Amount</span>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{agentDetails.amount}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Recipient / Account ID</span>
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{agentDetails.recipientId}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Issued Timestamp</span>
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{agentDetails.timestamp}</p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1 font-sans">
                <span className="text-slate-500 text-xs font-mono font-bold">Business Reason & Context</span>
                <p className="text-slate-900 dark:text-slate-100 font-medium text-xs">{agentDetails.reason}</p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Input Payload (Raw / Attached File Meta)</span>
                <p className="text-slate-800 dark:text-slate-200 font-mono text-xs break-all">{agentDetails.inputPayload}</p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
                <span className="text-slate-500">Output Payload (Tool Execution Result)</span>
                <p className="text-slate-800 dark:text-slate-200 font-mono text-xs break-all">{agentDetails.outputPayload}</p>
              </div>
            </div>
          </div>

          {/* Privacy Salted Commitment Explanation */}
          {(() => {
            const eventObj = "event" in evidence.record ? evidence.record.event : null;
            return (
              <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3 text-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300 font-mono text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Privacy-Preserving Salted Commitment</span>
                </div>
                <p className="leading-relaxed">
                  Plaintext payment payloads are not exposed directly in public transparency logs. Instead, CooL computes a salted multihash commitment (<code className="font-mono font-bold">mh:sha256</code>).
                </p>
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1.5 border border-slate-800">
                  <div>Active Plaintext Payload: &quot;{agentDetails.inputPayload}&quot;</div>
                  <div className="text-purple-400 font-bold">↓ Salted Hash Commitment:</div>
                  <div className="text-purple-300 truncate">{eventObj?.metadata_hash || "N/A"}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: Technical Parameters */}
      {activeTab === "technical" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border space-y-6 font-mono text-xs shadow-xl">
          {(() => {
            const eventObj = "event" in evidence.record ? evidence.record.event : null;
            return (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-slate-500">Record ID (ULID):</span>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-200 font-bold">
                    {recordId}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Execution ID:</span>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-200">
                    {executionId}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Canonical CBOR Binding Hash:</span>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-background border border-slate-200 dark:border-surface-border text-cyan-600 dark:text-cyan-400 font-bold">
                    {bindingHash}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Metadata Salted Commitment Hash:</span>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-background border border-slate-200 dark:border-surface-border text-purple-600 dark:text-purple-300 font-bold">
                    {eventObj?.metadata_hash || "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500">Signature Algorithm:</span>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-background border border-slate-200 dark:border-surface-border text-indigo-600 dark:text-indigo-300 font-bold">
                      {evidence.record.signature.alg}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500">Runtime Mode:</span>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-background border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold">
                      {evidence.record.runtime.mode.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: Raw JSON */}
      {activeTab === "raw" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-surface-border pb-4 font-mono text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Raw cool.receipt.v2 JSON Payload</span>
            <button
              onClick={handleCopyRaw}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-surface-border hover:bg-slate-200 dark:hover:bg-surface-hover text-slate-700 dark:text-slate-300 text-xs transition-colors font-sans"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-[480px] leading-relaxed border border-slate-800">
            {JSON.stringify(evidence, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
