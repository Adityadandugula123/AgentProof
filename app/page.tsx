"use client";

import React, { useState, useEffect } from "react";
import { Navbar, type TabType } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OverviewSection } from "@/components/OverviewSection";
import { AgentRunSection } from "@/components/AgentRunSection";
import { EvidenceReceiptSection } from "@/components/EvidenceReceiptSection";
import { VerifySection } from "@/components/VerifySection";
import { TamperLabSection } from "@/components/TamperLabSection";
import { DocumentUploadSection } from "@/components/DocumentUploadSection";
import type { AgentRunResult } from "@/lib/cool";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [agentResult, setAgentResult] = useState<AgentRunResult | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleAgentComplete = (result: AgentRunResult) => {
    setAgentResult(result);
    setIsVerified(true);
    setIsTampered(false);
  };

  const handleDocumentEvidenceCreated = (docRes: any) => {
    const convertedResult: AgentRunResult = {
      agentDetails: {
        agentName: "Document Vault Engine",
        action: "verify_file_digest",
        eventType: "artifact.document.upload",
        amount: `${(docRes.fileDetails.fileSize / 1024).toFixed(2)} KB`,
        currency: "FILE",
        recipientId: docRes.fileDetails.fileName,
        reason: docRes.fileDetails.notes,
        inputPayload: `File: ${docRes.fileDetails.fileName} (${docRes.fileDetails.fileSize} bytes, ${docRes.fileDetails.mimeType})`,
        outputPayload: `SHA-256 Multihash Digest: mh:sha256:${docRes.fileDetails.sha256Hash}`,
        status: "SUCCESS",
        timestamp: docRes.fileDetails.timestamp,
      },
      evidence: docRes.evidence,
      recordId: docRes.recordId,
      executionId: docRes.executionId,
      bindingHash: docRes.bindingHash,
      runtime: docRes.runtime,
      verdict: docRes.verdict,
    };
    setAgentResult(convertedResult);
    setIsVerified(true);
    setIsTampered(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasEvidence={!!agentResult}
        isVerified={isVerified}
        isTampered={isTampered}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewSection
            onRunAgent={() => setActiveTab("agent-run")}
            onViewVerify={() => setActiveTab("verify")}
          />
        )}

        {activeTab === "agent-run" && (
          <AgentRunSection
            onAgentComplete={handleAgentComplete}
            onViewEvidence={() => setActiveTab("evidence")}
            currentResult={agentResult}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceReceiptSection
            agentResult={agentResult}
            onGoToVerify={() => setActiveTab("verify")}
            onGoToRun={() => setActiveTab("agent-run")}
          />
        )}

        {activeTab === "verify" && (
          <VerifySection
            agentResult={agentResult}
            onGoToTamper={() => setActiveTab("tamper-lab")}
            onGoToRun={() => setActiveTab("agent-run")}
          />
        )}

        {activeTab === "tamper-lab" && (
          <TamperLabSection
            agentResult={agentResult}
            onGoToRun={() => setActiveTab("agent-run")}
          />
        )}

        {activeTab === "document-upload" && (
          <DocumentUploadSection
            onDocumentEvidenceCreated={handleDocumentEvidenceCreated}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
