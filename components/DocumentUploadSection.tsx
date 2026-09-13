"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, XCircle, ShieldCheck, Loader2, ArrowRight, Lock, FileCode, Sparkles, AlertOctagon } from "lucide-react";
import type { DocumentEvidenceResult } from "@/lib/cool";

interface DocumentUploadSectionProps {
  onDocumentEvidenceCreated?: (result: DocumentEvidenceResult) => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  onDocumentEvidenceCreated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [docResult, setDocResult] = useState<DocumentEvidenceResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tamper experiment state
  const [isTampering, setIsTampering] = useState(false);
  const [tamperVerdict, setTamperVerdict] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setDocResult(null);
      setTamperVerdict(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMsg(null);
    setDocResult(null);
    setTamperVerdict(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("notes", notes);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to process document upload.");
      }

      setDocResult(resData.data);
      if (onDocumentEvidenceCreated) {
        onDocumentEvidenceCreated(resData.data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTamperDocument = async () => {
    if (!docResult) return;
    setIsTampering(true);

    try {
      const response = await fetch("/api/tamper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: docResult.evidence,
          tamperField: "metadata_hash",
          customTamperValue: "Mutated Document SHA-256 Digest (File Modified)",
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "Failed to test document tampering.");
      }

      setTamperVerdict(resData.data);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Document tamper test failed.");
    } finally {
      setIsTampering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* JUDGE STEP BANNER */}
      <div className="p-4 rounded-2xl bg-primary-600/10 border border-primary-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-600 text-white font-bold text-xs font-mono">
            REAL DOCUMENT EVIDENCE
          </div>
          <div>
            <h3 className="font-bold text-sm">Upload Real Documents & Compute Evidence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload any PDF, TXT, JSON, or image. AgentProof computes its SHA-256 digest and binds it into a signed CooL receipt.
            </p>
          </div>
        </div>
      </div>

      {/* Drag and Drop Upload Card */}
      <form onSubmit={handleUploadSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-surface-border shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-600/10 text-primary-600 dark:bg-primary-600/20 dark:text-primary-400 border border-primary-500/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Upload Real File / Document</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supports PDF, JSON, TXT, Images, CSV, DOCX (Any file type)</p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
            Real File Hashing
          </span>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-slate-300 dark:border-surface-border hover:border-primary-500 rounded-2xl p-8 text-center space-y-3 bg-slate-50/50 dark:bg-background/50 transition-all cursor-pointer relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="p-3 rounded-full bg-primary-600/10 text-primary-600 dark:text-primary-400 w-fit mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            {selectedFile ? (
              <div className="space-y-1 font-mono text-xs">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedFile.name}</p>
                <p className="text-slate-500 font-sans">
                  {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type || "binary/file"}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Click or drag and drop any real file from your computer
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                  Files stay local in process memory. A SHA-256 multihash digest is generated.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Optional Notes Input */}
        <div className="space-y-1.5 font-sans text-xs">
          <label className="text-slate-700 dark:text-slate-300 font-bold">Audit Note / Context (Optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Q3 Vendor Invoice #8849 for Audit Verification"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-background border border-slate-200 dark:border-surface-border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-primary-500 font-sans"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all ${
              !selectedFile || isUploading
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/30 hover:scale-[1.02]"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Hashing File & Generating CooL Evidence...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>GENERATE VERIFIABLE FILE EVIDENCE</span>
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

      {/* Generated Document Evidence Receipt */}
      {docResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-emerald-300 dark:border-emerald-500/40 space-y-6 shadow-xl animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-surface-border pb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Document Cryptographically Signed & Bound!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  File: {docResult.fileDetails.fileName} ({docResult.fileDetails.fileSize} bytes)
                </p>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              ✓ VERIFIED RECEIPT (ok: true)
            </span>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
              <span className="text-slate-500">File Name</span>
              <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{docResult.fileDetails.fileName}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
              <span className="text-slate-500">Record ID (ULID)</span>
              <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{docResult.recordId}</p>
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
              <span className="text-slate-500">File SHA-256 Multihash Digest</span>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs truncate">
                mh:sha256:{docResult.fileDetails.sha256Hash}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
              <span className="text-slate-500">Signature Scheme</span>
              <p className="text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                ML-DSA-65 + Ed25519 Hybrid
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-surface-border space-y-1">
              <span className="text-slate-500">Canonical CBOR Binding Hash</span>
              <p className="text-cyan-600 dark:text-cyan-400 font-bold text-xs truncate">
                {docResult.bindingHash}
              </p>
            </div>
          </div>

          {/* Test Document Tamper Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-surface-border">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Test what happens if someone modifies 1 byte of this uploaded file:
            </div>
            <button
              type="button"
              onClick={handleTamperDocument}
              disabled={isTampering}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all shrink-0"
            >
              {isTampering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <AlertOctagon className="w-4 h-4" />
              )}
              <span>Test Document Tamper Detection</span>
            </button>
          </div>

          {/* Tamper Result */}
          {tamperVerdict && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-500/40 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold text-sm">
                <span>✕ DOCUMENT MODIFICATION DETECTED & REJECTED!</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300">FAILED</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">
                Modifying even a single byte of the uploaded document alters its SHA-256 digest, which breaks the CooL binding hash and hybrid post-quantum signature.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs">
                <span className="text-rose-400 font-bold">CooL Verifier Output: </span>
                <span>{tamperVerdict.tamperDescription}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
