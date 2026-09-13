"use client";

import React, { useState } from "react";
import { Cpu, Play, CheckCircle2, ArrowRight, Loader2, DollarSign, Sparkles, Sliders, UploadCloud, FileText, X } from "lucide-react";
import type { AgentRunResult } from "@/lib/cool";

interface AgentRunSectionProps {
  onAgentComplete: (result: AgentRunResult) => void;
  onViewEvidence: () => void;
  currentResult: AgentRunResult | null;
}

export const AgentRunSection: React.FC<AgentRunSectionProps> = ({
  onAgentComplete,
  onViewEvidence,
  currentResult,
}) => {
  // Form State
  const [agentName, setAgentName] = useState("AI Finance Refund Agent");
  const [action, setAction] = useState("issue_refund");
  const [eventType, setEventType] = useState("agent.action.refund");
  const [amount, setAmount] = useState("₹4,500");
  const [currency, setCurrency] = useState("INR");
  const [recipientId, setRecipientId] = useState("CUST-84920");
  const [reason, setReason] = useState("Duplicate subscription payment resolution");
  const [inputPayload, setInputPayload] = useState("Customer CUST-84920 refund request for ₹4,500 INR: Duplicate payment");
  const [outputPayload, setOutputPayload] = useState("Approved refund of ₹4,500 INR to account CUST-84920");

  // Optional File Upload State in Step 1
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    {
      label: "Standard Refund (₹4,500)",
      agentName: "AI Finance Refund Agent",
      action: "issue_refund",
      eventType: "agent.action.refund",
      amount: "₹4,500",
      currency: "INR",
      recipientId: "CUST-84920",
      reason: "Duplicate subscription payment resolution",
      inputPayload: "Customer CUST-84920 refund request for ₹4,500 INR: Duplicate payment",
      outputPayload: "Approved refund of ₹4,500 INR to account CUST-84920",
    },
    {
      label: "High-Value Transfer (₹12,000)",
      agentName: "Autonomous Treasury Agent",
      action: "wire_transfer",
      eventType: "agent.action.transfer",
      amount: "₹12,000",
      currency: "INR",
      recipientId: "ACCT-99210",
      reason: "Vendor invoice settlement approval",
      inputPayload: "Vendor ACCT-99210 wire request for ₹12,000 INR: Invoice #8849",
      outputPayload: "Initiated wire transfer of ₹12,000 INR to ACCT-99210",
    },
    {
      label: "Enterprise Credit Adjustment (₹45,000)",
      agentName: "Enterprise Credit Bot",
      action: "credit_adjustment",
      eventType: "agent.action.credit",
      amount: "₹45,000",
      currency: "INR",
      recipientId: "CORP-40182",
      reason: "Quarterly billing discrepancy credit",
      inputPayload: "Account CORP-40182 billing adjustment claim ₹45,000 INR",
      outputPayload: "Applied account credit adjustment ₹45,000 INR",
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setAgentName(p.agentName);
    setAction(p.action);
    setEventType(p.eventType);
    setAmount(p.amount);
    setCurrency(p.currency);
    setRecipientId(p.recipientId);
    setReason(p.reason);
    setInputPayload(p.inputPayload);
    setOutputPayload(p.outputPayload);
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    setInputPayload(`Customer ${recipientId} request for ${newAmount} ${currency}: ${reason}`);
    setOutputPayload(`Approved ${action} of ${newAmount} ${currency} to account ${recipientId}`);
  };

  const handleRecipientChange = (newRecipient: string) => {
    setRecipientId(newRecipient);
    setInputPayload(`Customer ${newRecipient} request for ${amount} ${currency}: ${reason}`);
    setOutputPayload(`Approved ${action} of ${amount} ${currency} to account ${newRecipient}`);
  };

  const handleReasonChange = (newReason: string) => {
    setReason(newReason);
    setInputPayload(`Customer ${recipientId} request for ${amount} ${currency}: ${newReason}`);
  };

  const handleActionChange = (newAction: string) => {
    setAction(newAction);
    setOutputPayload(`Approved ${newAction} of ${amount} ${currency} to account ${recipientId}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const executionSteps = [
    `Receiving request (${eventType}: ${amount} ${currency} for ${recipientId})...`,
    selectedFile ? `Hashing attached file (${selectedFile.name})...` : "Agent evaluating account history & policy rules...",
    `Invoking tool function (${action})...`,
    "Transaction executed successfully.",
    "Capturing CooL evidence & computing salted commitments...",
    "Cryptographically signing evidence (ML-DSA-65 + Ed25519)...",
    "Inserting evidence into RFC 6962 transparency log...",
    "Verifiable receipt ready for independent inspection.",
  ];

  const handleRunAgent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsRunning(true);
    setCurrentStepIndex(0);
    setErrorMsg(null);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < executionSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 200);

    try {
      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("agentName", agentName);
        formData.append("action", action);
        formData.append("eventType", eventType);
        formData.append("amount", amount);
        formData.append("currency", currency);
        formData.append("recipientId", recipientId);
        formData.append("reason", reason);
        formData.append("inputPayload", inputPayload);
        formData.append("outputPayload", outputPayload);

        response = await fetch("/api/trigger", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentName,
            action,
            eventType,
            amount,
            currency,
            recipientId,
            reason,
            inputPayload,
            outputPayload,
          }),
        });
      }

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to run agent scenario");
      }

      setTimeout(() => {
        setIsRunning(false);
        onAgentComplete(resData.data);
      }, 500);
    } catch (err: unknown) {
      const error = err as Error;
      setIsRunning(false);
      setErrorMsg(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* JUDGE STEP BANNER */}
      <div className="p-4 rounded-2xl bg-primary-600/10 border border-primary-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-600 text-white font-bold text-xs font-mono">
            STEP 1 OF 4
          </div>
          <div>
            <h3 className="font-bold text-sm">Configure & Execute Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize event details, upload real files/documents (optional), and click <strong>RUN AGENT & CREATE EVIDENCE</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form Card */}
      <form onSubmit={handleRunAgent} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-600/10 text-primary-600 dark:bg-primary-600/20 dark:text-primary-400 border border-primary-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Agent Action & Document Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customize parameters, upload real documents, or pick a preset</p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
            Interactive Form
          </span>
        </div>

        {/* Demo Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            Quick Demo Presets:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border hover:border-primary-500 text-slate-800 dark:text-slate-200 text-left transition-all hover:scale-[1.01]"
              >
                <div className="font-bold text-primary-600 dark:text-primary-400">{p.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{p.reason}</div>
              </button>
            ))}
          </div>
        </div>

        {/* OPTIONAL REAL FILE UPLOADER IN STEP 1 */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-primary-500" />
              <span>Attach Real Document / Log / Proof File (Optional)</span>
            </label>
            {selectedFile && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-[11px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove File</span>
              </button>
            )}
          </div>

          <div className="relative border-2 border-dashed border-slate-300 dark:border-surface-border hover:border-primary-500 rounded-xl p-4 text-center cursor-pointer bg-white dark:bg-background transition-all">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3 font-mono text-xs">
                <FileText className="w-5 h-5 text-primary-500" />
                <span className="font-bold text-slate-900 dark:text-white">{selectedFile.name}</span>
                <span className="text-slate-500 font-sans">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">✓ Ready for SHA-256 Hashing</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <UploadCloud className="w-4 h-4 text-slate-400" />
                <span>Click or drag and drop any file (`.pdf`, `.png`, `.jpg`, `.txt`, `.json`, `.docx`) to hash & attach to evidence</span>
              </div>
            )}
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-primary-500 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Event Type Identifier</label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-indigo-600 dark:text-indigo-400 font-mono font-bold focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Tool Function / Action</label>
            <input
              type="text"
              value={action}
              onChange={(e) => handleActionChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-primary-500 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Amount (Editable)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-emerald-600 dark:text-emerald-400 font-extrabold text-sm focus:outline-none focus:border-emerald-500 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Customer / Account ID</label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => handleRecipientChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-primary-500 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Business Reason / Context</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-primary-500 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Input Payload (Salted Commitment Target)</label>
            <textarea
              value={inputPayload}
              onChange={(e) => setInputPayload(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold">Output Payload (Salted Commitment Target)</label>
            <textarea
              value={outputPayload}
              onChange={(e) => setOutputPayload(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-primary-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isRunning}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all ${
              isRunning
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/30 hover:scale-[1.02]"
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Executing Agent & CooL Signing...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>RUN AGENT & CREATE EVIDENCE ({amount})</span>
              </>
            )}
          </button>
        </div>

        {/* Live Execution Log */}
        {(isRunning || currentStepIndex >= 0) && (
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-2.5 font-mono text-xs border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">Live Execution Log</span>
              {isRunning && <span className="text-primary-400 animate-pulse">Running CooL Engine...</span>}
            </div>

            <div className="space-y-1.5">
              {executionSteps.map((stepText, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex && isRunning;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 transition-opacity duration-150 ${
                      isCompleted ? "opacity-100 text-slate-200" : "opacity-30 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-primary-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={isCurrent ? "text-primary-300 font-bold" : ""}>
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}
      </form>

      {/* Completion Prompt */}
      {currentResult && !isRunning && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Action Executed & Evidence Signed for {currentResult.agentDetails.amount}!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Record ID: {currentResult.recordId} | Event: {currentResult.agentDetails.eventType}
                </p>
              </div>
            </div>

            <button
              onClick={onViewEvidence}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-[1.02]"
            >
              <span>Proceed to Step 2: View Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
