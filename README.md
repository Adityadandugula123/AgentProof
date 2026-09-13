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
