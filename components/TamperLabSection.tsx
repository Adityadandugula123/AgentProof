"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertOctagon, CheckCircle2, XCircle, Loader2, Sparkles, Edit3 } from "lucide-react";
import type { AgentRunResult } from "@/lib/cool";
import type { Verdict } from "cool-nwc";

interface TamperLabSectionProps {
  agentResult: AgentRunResult | null;
  onGoToRun: () => void;
}

export const TamperLabSection: React.FC<TamperLabSectionProps> = ({ agentResult, onGoToRun }) => {
  const [tamperAmount, setTamperAmount] = useState("₹45,000");
  const [isTampering, setIsTampering] = useState(false);
  const [tamperResult, setTamperResult] = useState<{
    tamperedEvidence: unknown;
    tamperDescription: string;
    originalValue: string;
    tamperedValue: string;
    verdict: Verdict;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!agentResult) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-slate-400 w-fit mx-auto">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Evidence to Tamper</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Run the Refund Agent first to generate evidence before executing the Tamper Lab attack simulation.
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

  const handleTamper = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTampering(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/tamper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: agentResult.evidence,
          tamperField: "metadata_hash",
          customTamperValue: tamperAmount,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to tamper and verify evidence.");
      }

      setTamperResult(resData.data);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Tamper experiment failed.");
    } finally {
      setIsTampering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* JUDGE STEP BANNER */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-600 text-white font-bold text-xs font-mono">
            STEP 4 OF 4 (THE AHA MOMENT)
          </div>
          <div>
            <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Simulate Unauthorized Record Edit</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type an altered amount below and click <strong>MUTATE & EXECUTE ATTACK</strong>. Watch CooL reject it!
            </p>
          </div>
        </div>
      </div>

      {/* Control Card */}
      <form onSubmit={handleTamper} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-surface-border pb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Original Genuine Evidence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Record ID: {agentResult.recordId}</p>
          </div>

          <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
            Genuine Amount: {agentResult.agentDetails.amount} (VALID)
          </span>
        </div>

        {/* Custom Tamper Input Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-background/80 border border-slate-200 dark:border-surface-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-rose-500" />
              <span>Simulated Unauthorized Amount Edit:</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTamperAmount("₹45,000")}
                className="px-2 py-1 rounded bg-slate-200 dark:bg-surface-card hover:bg-rose-500 hover:text-white text-[10px] text-slate-700 dark:text-slate-300 transition-colors"
              >
                ₹45,000
              </button>
              <button
                type="button"
                onClick={() => setTamperAmount("₹120,000")}
                className="px-2 py-1 rounded bg-slate-200 dark:bg-surface-card hover:bg-rose-500 hover:text-white text-[10px] text-slate-700 dark:text-slate-300 transition-colors"
              >
                ₹120,000
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Genuine: {agentResult.agentDetails.amount}</span>
            <span className="text-rose-500 font-bold">→ MUTATE TO →</span>
            <input
              type="text"
              value={tamperAmount}
              onChange={(e) => setTamperAmount(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-surface border border-rose-500/40 text-rose-600 dark:text-rose-400 font-extrabold text-sm focus:outline-none"
              placeholder="e.g. ₹45,000"
              required
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            In a standard log or database, an admin can change {agentResult.agentDetails.amount} to {tamperAmount} undetected. In AgentProof, mutating the payload alters its canonical digest, breaking the hybrid signature.
          </p>
        </div>

        {/* Trigger Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isTampering}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isTampering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mutating Record & Re-Verifying...</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-5 h-5" />
                <span>MUTATE RECORD ({agentResult.agentDetails.amount} → {tamperAmount})</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}
      </form>

      {/* Result Panel */}
      {tamperResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-rose-500/40 space-y-6 shadow-xl animate-fadeIn">
          {/* Success Explanation Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm block">
                  🎉 PROTECTION WORKING PERFECTLY! (TAMPER SUCCESSFULLY REJECTED)
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Because you mutated the amount from <strong>{agentResult.agentDetails.amount}</strong> to <strong>{tamperAmount}</strong>, CooL&apos;s verifier mathematically caught the forgery and rejected it. This proves nobody can edit logs undetected!
                </p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-surface-border pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                  ✕ FORGED RECORD REJECTED BY VERIFIER
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Cryptographic Rejection By CooL Post-Quantum Signature Engine
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-card border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-surface-border pb-2">
                <span>GENUINE RECORD</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300">
                <div>Amount: <span className="font-bold">{agentResult.agentDetails.amount}</span></div>
                <div>Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">VALID</span></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold border-b border-slate-200 dark:border-surface-border pb-2">
                <span>TAMPERED RECORD</span>
                <XCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300">
                <div>Amount: <span className="text-rose-600 dark:text-rose-400 font-bold">{tamperAmount}</span></div>
                <div>Status: <span className="text-rose-600 dark:text-rose-400 font-bold">INVALID (REJECTED)</span></div>
              </div>
            </div>
          </div>

          {/* Failed Reasons */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-rose-400 font-bold flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              <span>Real Failed Checks Returned By CooL SDK:</span>
            </div>

            <ul className="space-y-1.5 text-slate-300">
              {tamperResult.verdict.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
