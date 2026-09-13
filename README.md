# AgentProof — Verifiable Evidence Layer for AI Agents

> **DON'T TRUST THE LOG. VERIFY THE EVIDENCE.**

**AgentProof** is an independently verifiable cryptographic evidence layer for AI-agent actions, powered by the **CooL SDK** (`cool-nwc` v3.0.0).

---

## 1. Problem

AI agents are increasingly delegated consequential authority — issuing refunds, transferring funds, executing wire orders, and updating enterprise records.

Traditional logging stores actions as editable database rows or plain text log files. An administrator, malicious insider, or compromised service can silently alter a log entry (e.g. changing a ₹4,500 refund log to ₹45,000) without breaking any database signature or leaving detectable proof.

---

## 2. Solution

AgentProof wraps AI agent tool calls in cryptographic evidence receipts. Whenever an agent acts, AgentProof creates a self-contained, tamper-evident receipt carrying:

- **Salted privacy-preserving commitments** (`mh:sha256`) over sensitive input/output payloads.
- **Hybrid post-quantum signatures** combining classical **Ed25519** and post-quantum **ML-DSA-65** (FIPS 204).
- **RFC 6962 transparency log** inclusion proofs.
- **Offline verification capabilities** across 7 independent trust domains.

---

## 3. Why CooL?

**CooL** (`cool-nwc`) is the cryptographic evidence engine underneath AgentProof. While traditional logs rely on trust in server security, CooL provides **mathematical proof**. 

CooL shift governance from *"trusting that the log was not edited"* to *"verifying the cryptographic evidence offline against the keys it carries"*.

---

## 4. How CooL Is Used (Real Code Paths)

In AgentProof, CooL APIs are invoked directly in Node.js server route handlers:

1. **Recording Evidence** (`lib/cool.ts`):
   ```ts
   const recordResult = await cool.record({
     type: "agent.action.refund",
     metadata: { agent: "AI Refund Agent", action: "issue_refund", amount: "₹4,500" },
     payloads: { input: "Refund request ₹4,500", output: "Approved refund ₹4,500" },
     software: { name: "AgentProof", version: "1.0.0", digest: null }
   });
   await cool.ready();
   ```

2. **Verifying Evidence** (`lib/cool.ts`):
   ```ts
   const verdict = await verifyEvidence(evidence);
   // Returns structured verdict with 7 domain checks: binding, signature, inclusion, witnesses, attestation, enclave, anchor
   ```

3. **Tamper Detection** (`lib/cool.ts`):
   ```ts
   // Mutating payload hash breaks the ML-DSA-65 + Ed25519 signature
   evidence.record.event.metadata_hash = alteredHash;
   const verdict = await verifyEvidence(evidence);
   // verdict.ok === false with reasons: "signature: ML-DSA-65 and Ed25519 did not verify"
   ```

---

## 5. Architecture

```text
                  AI AGENT ACTION
                         │
                         ▼
                AGENTPROOF SYSTEM
                         │
                         ▼
                     CooL SDK
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
   COMMIT HASH        HYBRID SIGN       STH LOG
   (mh:sha256)     (ML-DSA-65/Ed25519) (RFC 6962)
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
               cool.receipt.v2 ENVELOPE
                         │
                         ▼
             OFFLINE 7-DOMAIN VERIFIER
                         │
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
✓ GENUINE RECEIPT                     ✕ TAMPERED RECEIPT
 (ok: true, PASS)                      (ok: false, REJECTED)
```

---

## 6. Technical Decisions

- **Framework**: Next.js 14 (App Router) + React 18.
- **Cryptographic Runtime**: Node.js WebCrypto primitives via `cool-nwc` (Stateless server-side verification).
- **Styling & Design System**: TailwindCSS with dark/light mode toggle and Inter + JetBrains Mono typography.
- **Privacy Design**: Sensitive payment payloads are bound as salted SHA-256 multihash commitments (`mh:sha256`), preventing plaintext leakage in public logs.

---

## 7. Running Locally

### Prerequisites
- Node.js v20.0.0 or higher.

### Installation & Execution Commands
```bash
# 1. Clone repository
git clone https://github.com/Adityadandugula123/AgentProof.git
cd AgentProof

# 2. Install dependencies (compiles local cool-sdk-repo package)
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Production Build & Local Server
```bash
npm run build
npm run start
```

---

## 8. Hackathon 3-Minute Demo Flow

1. **Step 1: Run Agent**: Click **Run Refund Agent** (issues ₹4,500 refund, calls `cool.record()`, generates CooL evidence).
2. **Step 2: Evidence**: Inspect the receipt showing salted commitments, hybrid keys, and schema `cool.receipt.v2`.
3. **Step 3: Verify**: Click **VERIFY LIVE EVIDENCE NOW**. Runs standalone offline verifier across 7 trust domains (measured timing in ms).
4. **Step 4: Tamper Lab**: Mutate amount from `₹4,500` → `₹45,000`. Click **MUTATE RECORD**. CooL rejects the tampered receipt with `✕ FORGED RECORD REJECTED BY VERIFIER`.
5. **Step 5: Upload Real File**: Upload any `.pdf`, `.json`, `.txt`, `.png` file. Computes SHA-256 multihash digest and signs file evidence.

---

## 9. Limitations & Technical Honesty

- **Attestation Status**: Attestation reports `SIMULATED` because a production TEE provider (Intel TDX / Phala dstack) is not configured in this local environment.
- **Integrity Scope**: AgentProof proves **evidence integrity** (that the record was not modified post-hoc). It does not judge whether the AI agent's business decision was morally correct.

---

## 10. Future Scope

- **Production Hardware TEE**: Direct integration with Phala dstack / Intel TDX remote attestation quotes.
- **Enterprise Governance Dashboards**: Multi-agent compliance packs and policy enforcement.
- **Cross-Chain Anchoring**: Automated OpenTimestamps Bitcoin block anchoring for immutable timestamp verification.


# AgentProof

### **From "Trust the Log" to "Verify the Evidence"**

> **AgentProof is a privacy-preserving cryptographic evidence layer for AI-agent actions, built using the CooL SDK.**

AI agents are increasingly capable of taking consequential actions — issuing refunds, approving transactions, accessing sensitive systems, and calling external tools. But when something goes wrong, a conventional log only tells us **what the system claims happened**.

The real question is:

> **Can we independently verify that the recorded AI-agent action has not been tampered with?**

AgentProof addresses this problem by generating **cryptographically verifiable evidence receipts** for important agent actions.

---

## 🚨 The Problem

AI agents are moving from simply generating responses to **taking real actions**.

Examples include:

* Processing refunds
* Approving payments
* Updating customer records
* Accessing enterprise systems
* Executing API/tool calls
* Handling sensitive information

Traditional audit logs are useful for observability and debugging, but they are not designed to provide strong, independently verifiable proof of the integrity of a recorded event.

For example:

```text
Normal Log

Refund Agent
Amount: ₹4,500
Status: SUCCESS
```

If someone later changes the stored record to:

```text
Amount: ₹45,000
```

a normal log may not provide a cryptographic mechanism for independently detecting that modification.

### The gap

**Observability tells us what was recorded.
Verifiable evidence lets us check whether that evidence is still cryptographically consistent.**

---

# 💡 Our Solution

AgentProof adds an evidence layer around an AI agent.

Instead of simply writing an action to a normal log:

```text
AI Agent
   ↓
Normal Log
   ↓
Trust the Record
```

AgentProof creates cryptographic evidence:

```text
AI Agent
   ↓
AgentProof
   ↓
CooL SDK
   ↓
Cryptographic Evidence
   ↓
Verification
   ↓
✓ Valid / ✕ Tampered
```

The application records the important event through the **CooL SDK**, producing an evidence receipt that can later be verified.

Sensitive values can be represented through cryptographic commitments rather than simply being exposed as plaintext inside the evidence.

---

# 🔐 Why CooL?

CooL is the core cryptographic evidence engine behind AgentProof.

AgentProof does **not** reinvent cryptographic signing and verification.

Instead, we use CooL to provide the underlying evidence workflow while building the application, agent scenario, evidence interface, verification experience, and tamper demonstration around it.

The core integration uses:

```text
CooL.record()
        ↓
Evidence Receipt
        ↓
verifyEvidence()
        ↓
Verification Verdict
```

This makes CooL a **meaningful part of the product architecture**, rather than simply being included as a dependency.

### CooL enables the evidence pipeline:

**OBSERVE → COMMIT → SIGN → ATTEST → ANCHOR → VERIFY**

The exact cryptographic and attestation capabilities depend on the configured CooL environment.

---

# ⚙️ How AgentProof Works

### 1. OBSERVE

The AI agent performs an action.

Example:

```text
Refund Agent
Action: Issue Refund
Amount: ₹4,500
Tool: Payment API
```

### 2. COMMIT

Relevant information is cryptographically committed so that sensitive information does not need to be stored directly as plaintext in the evidence receipt.

### 3. SIGN

The evidence is cryptographically signed through CooL.

### 4. ATTEST

Runtime/attestation information can be associated with the evidence where supported by the configured CooL environment.

### 5. ANCHOR

The evidence can be associated with CooL's transparency/evidence infrastructure.

### 6. VERIFY

The evidence is independently checked using the CooL verifier.

```text
                    AI AGENT
                       │
                       ▼
                  AgentProof
                       │
                       ▼
                    CooL
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      Commit          Sign          Anchor
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                Evidence Receipt
                       │
                       ▼
                  Verification
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          ✓ VALID            ✕ TAMPERED
```

---

# 🧪 Live Tamper Demonstration

The core proof of the product is intentionally simple.

### Step 1 — Execute the agent action

```text
Refund = ₹4,500
```

AgentProof generates a cryptographic evidence receipt.

### Step 2 — Verify the receipt

```text
✓ Evidence Valid
```

### Step 3 — Modify the evidence

We change:

```text
₹4,500 → ₹45,000
```

### Step 4 — Verify again

```text
✕ Verification Failed
```

The verifier detects that the modified evidence no longer satisfies the cryptographic relationships established for the original evidence.

### Why this matters

Instead of saying:

> **"Our logs cannot be changed."**

we demonstrate:

> **"Try changing the evidence and verify it yourself."**

---

# 🧠 What AgentProof Proves — and What It Doesn't

AgentProof is intentionally focused.

### It helps establish:

* Integrity of recorded evidence
* Cryptographic authenticity properties
* Detectability of post-record modification
* Evidence provenance provided by the underlying CooL system
* A privacy-aware representation of sensitive information

### It does NOT claim to prove:

* That an AI decision was morally correct
* That an AI decision was fair
* That a refund should have happened
* That the AI cannot make mistakes
* That the AI itself is inherently trustworthy

**AgentProof proves what was recorded and whether the evidence remains cryptographically verifiable — not whether the underlying decision was correct.**

This distinction is fundamental to the product.

---

# 🔒 Privacy by Design

AI-agent actions can contain sensitive information such as:

* Customer information
* Financial information
* Internal prompts
* Model outputs
* API payloads
* Enterprise data

An audit system should not create another repository of sensitive plaintext data.

AgentProof therefore uses the evidence mechanisms provided by CooL to represent relevant sensitive values through cryptographic commitments where supported.

### Goal:

```text
Sensitive Data
      ↓
Cryptographic Commitment
      ↓
Verifiable Evidence
```

This allows organizations to pursue accountability without unnecessarily exposing sensitive payloads in audit evidence.

---

# 🌟 What Makes AgentProof Different?

### 1. Agent-Native Accountability

Designed specifically around actions performed by autonomous AI agents.

### 2. Cryptographic Evidence

Moves beyond ordinary application logs toward verifiable evidence.

### 3. Privacy-Aware

Sensitive values do not need to become plaintext audit records.

### 4. Independently Verifiable

The evidence can be passed through a verifier rather than relying solely on a UI status.

### 5. Tamper Demonstration

The product visibly demonstrates the security property by modifying evidence and verifying it again.

### 6. Meaningful CooL Integration

CooL is used for the actual evidence generation and verification workflow.

### 7. Extensible Architecture

The refund scenario is only a demonstration. The same model can be applied to many consequential agent tool calls.

---

# 🏗️ Architecture

```text
┌──────────────────────────────┐
│          AI AGENT            │
│   Refund / Payment / Tool    │
│           Action             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         AGENTPROOF           │
│                              │
│  Agent Action + Evidence UI  │
│  Receipt + Verify + Tamper   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          COO L SDK           │
│                              │
│       record()               │
│       Evidence Engine        │
│       Verification           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      CRYPTOGRAPHIC           │
│         EVIDENCE             │
│                              │
│ Commitments / Signatures /   │
│ Evidence / Verification      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        VERIFIER              │
│                              │
│      verifyEvidence()        │
└──────────────┬───────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
     ✓ VALID       ✕ INVALID
```

---

# 🛠️ Technology Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Frontend       | Next.js / React                        |
| Styling        | Tailwind CSS                           |
| Backend        | Next.js API Routes / Node.js           |
| Evidence Layer | CooL SDK                               |
| Cryptography   | CooL cryptographic evidence mechanisms |
| Verification   | CooL `verifyEvidence()`                |
| Deployment     | Vercel                                 |
| Repository     | GitHub                                 |

The application keeps the CooL cryptographic operations on the server side where required by the SDK/runtime environment.

---

# 🎯 Real-World Applications

## FinTech

Create verifiable evidence for:

* Refunds
* Payments
* Transaction approvals
* Financial agent actions

## Healthcare

Create accountable evidence for:

* AI-assisted workflows
* Sensitive record access
* Agent tool calls

## Insurance

Verify evidence around:

* Claims processing
* Automated approvals
* Policy workflows

## Enterprise AI

Track and verify consequential actions performed by:

* Internal AI agents
* Autonomous workflows
* Tool-using copilots

## Agentic Payments

Provide evidence around agents that interact with financial APIs and payment systems.

---

# 📈 Impact

AgentProof aims to help organizations move from:

```text
"Trust our logs."
```

to:

```text
"Verify the evidence."
```

Potential benefits include:

* Faster incident reconstruction
* Stronger audit evidence
* Better AI accountability
* Reduced exposure of sensitive audit data
* Easier investigation of agent actions
* Increased confidence in deploying consequential AI agents

---

# 🚀 Future Roadmap

AgentProof is designed as an infrastructure layer rather than a single refund application.

### Phase 1 — Real TEE Attestation

Replace simulated/local attestation with production hardware-backed attestation such as a supported dstack/TEE deployment.

### Phase 2 — Evidence Packs

Combine multiple verified receipts into exportable:

* Audit reports
* Compliance evidence packs
* Incident reports

### Phase 3 — Enterprise Governance

Build a dashboard for organizations managing hundreds or thousands of AI-agent actions.

Potential metrics:

```text
Total Agent Actions
Verified Actions
Failed Verifications
High-Risk Actions
Tampering Attempts
Agent Activity
```

### Phase 4 — Multi-Agent Support

Extend beyond refund agents to:

* Payment agents
* Claims agents
* Healthcare agents
* Procurement agents
* Support agents
* Enterprise automation agents

### Phase 5 — Universal Tool-Call Evidence

Support arbitrary agent tool calls:

```text
AI Agent
   ↓
Tool Call
   ↓
AgentProof Evidence
   ↓
CooL Verification
```

### Phase 6 — Policy + Evidence

Combine prevention with accountability:

```text
Agent wants to act
        ↓
Policy Engine
        ↓
Allowed?
    /       \
  YES        NO
   ↓          ↓
Execute     Block
   ↓
AgentProof
   ↓
Evidence
```

### Phase 7 — Continuous Agent Audit Trail

Move from individual receipts to complete verifiable execution histories, allowing organizations to reconstruct an agent's actions during incidents.

---

# ⚠️ Current Limitations

The current hackathon build intentionally focuses on a working vertical slice.

Current limitations include:

* Refund scenario is simulated
* Attestation may be simulated when no real TEE provider is configured
* Current demo focuses on a single agent scenario
* Production persistence and multi-tenant enterprise infrastructure are future work

These limitations are intentionally disclosed rather than hidden.

The goal of the hackathon version is to demonstrate the **core evidence → verification → tamper-detection workflow** clearly and reliably.

---

# 🔬 Why This Is More Than a Dashboard

AgentProof is not primarily an analytics dashboard.

The core product is the **evidence lifecycle**:

```text
AGENT ACTION
     ↓
OBSERVE
     ↓
COMMIT
     ↓
SIGN
     ↓
ATTEST
     ↓
ANCHOR
     ↓
VERIFY
```

The UI exists to make this process understandable, inspectable and demonstrable.

The key technical property is that verification is based on the evidence and the underlying CooL verification mechanism — not simply a hardcoded green status.

---

# 🧩 Why This Matters for AI

As AI systems become more autonomous, the question changes from:

> **"Can AI perform the task?"**

to:

> **"Can we trust and investigate what AI did?"**

AgentProof addresses one part of that larger problem:

## Verifiable accountability for consequential AI actions.

It does not attempt to solve every AI safety problem.

It provides an evidence foundation that other systems — policy engines, governance platforms, security systems and enterprise controls — can build upon.

---

# 🏆 The Core Innovation

Traditional systems focus on:

```text
OBSERVE
↓
LOG
↓
TRUST
```

AgentProof focuses on:

```text
OBSERVE
↓
CREATE EVIDENCE
↓
CRYPTOGRAPHICALLY BIND
↓
VERIFY
```

That is the fundamental shift:

# **From Trusting Logs → To Verifying Evidence**

---

# 📌 Demo Flow

The complete demonstration takes four steps:

```text
1. RUN AGENT
   ↓
2. GENERATE EVIDENCE
   ↓
3. VERIFY EVIDENCE
   ↓
4. TAMPER + VERIFY AGAIN
```

### Expected result:

```text
₹4,500
   ↓
✓ VALID

₹4,500 → ₹45,000
   ↓
✕ INVALID
```

The demonstration makes the core security property visible instead of asking the audience to simply trust our claims.

---

# 🔗 Project

**AgentProof — Verifiable Evidence for AI-Agent Actions**

Built using the **CooL SDK**.

### Core message

> **AI agents can act autonomously. AgentProof makes their consequential actions verifiable.**

# **DON'T TRUST THE LOG. VERIFY THE EVIDENCE.**









==========================================================================================================================================================




VERCEL DEPLOYED LINK : https://agent-proof-ten.vercel.app/
