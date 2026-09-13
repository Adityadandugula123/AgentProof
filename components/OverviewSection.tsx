"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  FileCheck2,
  Lock,
  ArrowRight,
  Eye,
  Key,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface OverviewSectionProps {
  onRunAgent: () => void;
  onViewVerify: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onRunAgent, onViewVerify }) => {
  const pipelineSteps = [
    {
      number: "01",
      title: "OBSERVE",
      desc: "Agent executes a refund (₹4,500). CooL captures execution parameters.",
      icon: Eye,
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      number: "02",
      title: "COMMIT",
      desc: "Sensitive values become cryptographic salted hashes (mh:sha256).",
      icon: Lock,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      number: "03",
      title: "SIGN",
      desc: "Signed with post-quantum ML-DSA-65 + Ed25519 hybrid signatures.",
      icon: Key,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
    {
      number: "04",
      title: "ATTEST",
      desc: "Runtime measurements and enclave quotes are cryptographically bound.",
      icon: Shield,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      number: "05",
      title: "ANCHOR",
      desc: "Logged into an append-only RFC 6962 transparency Merkle tree.",
      icon: Layers,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      number: "06",
      title: "VERIFY",
      desc: "Standalone offline verifier checks 7 trust domains without trusting logs.",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* JUDGE GUIDED TOUR BANNER */}
      <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border text-slate-900 dark:text-white space-y-4 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm text-primary-600 dark:text-primary-400">
          <Sparkles className="w-5 h-5" />
          <span>HACKATHON JUDGE DEMO GUIDE (3-MINUTE TOUR)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          <button
            onClick={onRunAgent}
            className="p-3 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border text-left hover:border-primary-500 transition-all group"
          >
            <div className="text-primary-600 dark:text-primary-400 font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform">
              Step 1: Run Agent →
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px]">Issue ₹4,500 refund & generate evidence</div>
          </button>

          <button
            onClick={onRunAgent}
            className="p-3 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border text-left hover:border-primary-500 transition-all group"
          >
            <div className="text-primary-600 dark:text-primary-400 font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform">
              Step 2: Evidence →
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px]">Inspect salted cryptographic receipt</div>
          </button>

          <button
            onClick={onViewVerify}
            className="p-3 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border text-left hover:border-emerald-500 transition-all group"
          >
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform">
              Step 3: Verify →
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px]">Run offline 7-domain verifier</div>
          </button>

          <button
            onClick={onViewVerify}
            className="p-3 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border text-left hover:border-rose-500 transition-all group"
          >
            <div className="text-rose-600 dark:text-rose-400 font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform">
              Step 4: Tamper Lab →
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px]">Altered ₹4,500 → ₹45,000 gets rejected</div>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Verifiable Evidence Layer Powered by CooL SDK</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          PROVE WHAT AI AGENTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-cyan-600 dark:from-primary-400 dark:via-indigo-300 dark:to-cyan-400">ACTUALLY DID.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
          AgentProof creates cryptographically verifiable evidence receipts whenever an AI agent acts — replacing unverified logs with offline-verifiable proof.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onRunAgent}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-600/20 transition-all hover:scale-[1.02]"
          >
            <Cpu className="w-5 h-5" />
            <span>Start Interactive Demo (Run Refund Agent)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Clear Problem Comparison Section */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Fundamental Difference: Log vs Evidence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Why ordinary application logging fails security audits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Log */}
          <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-rose-500/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-surface-border pb-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <XCircle className="w-4 h-4" />
                <span>TRADITIONAL LOG (Trust-Based)</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded font-bold">
                Can Be Edited
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1 border border-slate-800">
              <div className="text-slate-500">// Ordinary Server Log</div>
              <div>[2026-09-13] Agent: Refund Bot</div>
              <div className="text-amber-400 font-bold">[2026-09-13] Amount: ₹4,500</div>
              <div>[2026-09-13] Status: SUCCESS</div>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-slate-100">The Problem:</p>
              <p>A database admin can edit ₹4,500 to ₹45,000 post-hoc without breaking any signature or leaving proof.</p>
            </div>
          </div>

          {/* AgentProof Evidence */}
          <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-emerald-300 dark:border-emerald-500/40 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-surface-border pb-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>AGENTPROOF EVIDENCE (Cryptographic)</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                Tamper-Evident
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1 border border-slate-800">
              <div className="text-emerald-400">// CooL Receipt v2</div>
              <div>Salted Commitment: mh:sha256:85f0d...</div>
              <div>Signature: ML-DSA-65 + Ed25519</div>
              <div className="text-emerald-400 font-bold">Verifier Status: ✓ VALID</div>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-slate-100">The Guarantee:</p>
              <p>Post-hoc modification is detected by cryptographic verification, causing the affected verification checks to fail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Visual Lifecycle */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How CooL Powers AgentProof
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
            OBSERVE → COMMIT → SIGN → ATTEST → ANCHOR → VERIFY
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {step.number}
                  </span>
                  <div className={`p-2 rounded-xl border ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why CooL & Honesty Note */}
      <section className="max-w-4xl mx-auto p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border space-y-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-surface-border pb-3">
          <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Architecture & Scope Honesty
          </h3>
        </div>

        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed font-normal">
          <p>
            <strong>AgentProof</strong> is the application experience and AI scenario layer. <strong>CooL</strong> (`cool-nwc`) is the underlying cryptographic evidence engine.
          </p>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              CooL proves evidence integrity (that the record was not altered post-hoc). CooL does not judge whether the AI&apos;s financial decision was morally correct or business-safe.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
