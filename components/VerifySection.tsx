"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, AlertTriangle, XCircle, Loader2, ArrowRight, ShieldAlert, Sparkles, RefreshCw, Code, Eye, Clock } from "lucide-react";
import type { AgentRunResult } from "@/lib/cool";
import type { Verdict } from "cool-nwc";

interface VerifySectionProps {
  agentResult: AgentRunResult | null;
  onGoToTamper: () => void;
  onGoToRun: () => void;
}

export const VerifySection: React.FC<VerifySectionProps> = ({
  agentResult,
  onGoToTamper,
  onGoToRun,
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifyStep, setVerifyStep] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"simple" | "technical">("simple");

  if (!agentResult) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-slate-400 w-fit mx-auto">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Evidence Available</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Run the Refund Agent first in Step 1 to generate cryptographic evidence before verifying.
        </p>
        <button
          onClick={onGoToRun}
          className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-lg transition-all"
        >
          Go to Step 1: Run Agent
        </button>
      </div>
    );
  }

  const handleVerify = async () => {
    setVerifying(true);
    setVerdict(null);
    setDurationMs(null);
    setErrorMsg(null);
    setVerifyStep("1/4: Checking canonical CBOR binding hash...");

    setTimeout(() => {
      setVerifyStep("2/4: Verifying hybrid ML-DSA-65 + Ed25519 signatures...");
    }, 200);

    setTimeout(() => {
      setVerifyStep("3/4: Checking RFC 6962 Merkle inclusion path...");
    }, 400);

    setTimeout(() => {
      setVerifyStep("4/4: Evaluating runtime attestation & enclave measurement...");
    }, 600);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence: agentResult.evidence }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to verify evidence.");
      }

      setTimeout(() => {
        setVerifying(false);
        setVerifyStep(null);
        setVerdict(resData.verdict);
        if (typeof resData.durationMs === "number") {
          setDurationMs(resData.durationMs);
        }
      }, 700);
    } catch (err: unknown) {
      const error = err as Error;
      setVerifying(false);
      setVerifyStep(null);
      setErrorMsg(error.message || "Verification failed.");
    }
  };

  const domainExplanations: Record<string, string> = {
    binding: "Checks canonical CBOR hash consistency with core parameters.",
    signature: "Verifies hybrid post-quantum ML-DSA-65 + Ed25519 signatures.",
    inclusion: "Verifies Merkle inclusion proof against RFC 6962 transparency log.",
    witnesses: "Evaluates external witness co-signatures on STH.",
    attestation: "Evaluates runtime attestation mode (simulated root vs hardware TEE).",
    enclave: "Verifies signing key binding to measured enclave code.",
    anchor: "Checks OpenTimestamps / public chain proof.",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* JUDGE STEP BANNER */}
      <div className="p-4 rounded-2xl bg-primary-600/10 border border-primary-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-600 text-white font-bold text-xs font-mono">
            STEP 3 OF 4
          </div>
          <div>
            <h3 className="font-bold text-sm">Run Standalone CooL Verifier</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click <strong>VERIFY LIVE EVIDENCE NOW</strong> to run independent cryptographic verification on the active agent record.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToTamper}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <span>Test Tampering (Step 4: Tamper Lab)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Verify Control Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border shadow-xl space-y-6 text-center">
        <div className="space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
          <div>Target Subject: <span className="text-slate-900 dark:text-white font-bold">{agentResult.agentDetails.agentName} ({agentResult.agentDetails.action})</span></div>
          <div>Record ID: <span className="text-slate-700 dark:text-slate-200 font-bold">{agentResult.recordId}</span></div>
          <div>Amount: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{agentResult.agentDetails.amount}</span></div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center justify-center gap-3.5 px-10 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all hover:scale-[1.02] cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
          >
            {verifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Verification Routine...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                <span>VERIFY LIVE EVIDENCE NOW</span>
              </>
            )}
          </button>
        </div>

        {/* Live Verifier Progress Step */}
        {verifying && verifyStep && (
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2 font-mono text-xs border border-slate-800 animate-fadeIn max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 text-primary-400 font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>CooL Offline Verifier Executing...</span>
            </div>
            <p className="text-slate-300 font-semibold">{verifyStep}</p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Verdict Result */}
      {verdict && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border space-y-6 shadow-xl animate-fadeIn">
          {/* Header & Live Verification Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-surface-border pb-6">
            <div className="flex items-center gap-3">
              {verdict.ok ? (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
              <div>
                <h3 className={`text-2xl font-extrabold tracking-tight ${verdict.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {verdict.ok ? "✓ EVIDENCE VERIFIED & VALID (ok: true)" : "✕ EVIDENCE INVALID — VERIFICATION FAILED (ok: false)"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {verdict.ok ? "All Post-Quantum Signatures & Commitments Match" : "Cryptographic Hash & Signature Mismatch Detected"}
                </p>
              </div>
            </div>

            {/* Measured Timing Indicator */}
            {durationMs !== null && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 shrink-0">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>● LIVE VERIFICATION: {durationMs} ms</span>
              </div>
            )}
          </div>

          {/* Simple vs Technical View Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-surface p-1 rounded-xl border border-slate-200 dark:border-surface-border w-fit font-mono text-xs">
            <button
              onClick={() => setActiveView("simple")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                activeView === "simple"
                  ? "bg-white dark:bg-surface-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-surface-border"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simple View (7 Domains)</span>
            </button>

            <button
              onClick={() => setActiveView("technical")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                activeView === "technical"
                  ? "bg-white dark:bg-surface-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-surface-border"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-cyan-500" />
              <span>Technical View (Raw Verdict JSON)</span>
            </button>
          </div>

          {/* Simple View */}
          {activeView === "simple" && (
            <div className="space-y-4">
              {/* Failed Reasons if ok is false */}
              {!verdict.ok && verdict.reasons && verdict.reasons.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
                  <div className="text-rose-400 font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Exact Failure Reasons Returned By CooL Verifier:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {verdict.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Honest Attestation Note */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 font-sans space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Honest Attestation Status: SIMULATED</span>
                </div>
                <p>
                  Evidence verification runs <strong>LIVE</strong> on server-side WebCrypto algorithms. Attestation reports <strong>SIMULATED</strong> because a production TEE provider (Intel TDX / Phala dstack) is not configured in this environment.
                </p>
              </div>

              {/* 7 Domains Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  7 Cryptographic Trust Domains Breakdown (Live SDK Output)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  {Object.entries(verdict.checks).map(([domain, check]) => {
                    let statusBadge = (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                        PASS
                      </span>
                    );
                    if (check.status === "simulated") {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold">
                          SIMULATED
                        </span>
                      );
                    } else if (check.status === "fail") {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold">
                          FAILED
                        </span>
                      );
                    } else if (check.status === "absent" || check.status === "mock") {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          ABSENT
                        </span>
                      );
                    }

                    return (
                      <div
                        key={domain}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white uppercase">{domain}</span>
                          {statusBadge}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                          {domain === "attestation" && check.status === "simulated"
                            ? "This demo uses CooL's simulator because a production TEE provider is not configured."
                            : domainExplanations[domain] || check.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Technical View */}
          {activeView === "technical" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-cyan-400">Verbatim CooL Verifier Response Object</span>
                  <span className="text-[10px] text-slate-400">cool.verdict.v2</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 overflow-x-auto text-[11px] leading-relaxed max-h-[420px]">
                  {JSON.stringify(verdict, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

