# AgentProof — Verifiable Evidence Layer for AI Agents

> **From “trust the log” to “verify the evidence.”**

AgentProof is a working Round 2 Reverse Hackathon product built on top of the **CooL SDK** (`cool-nwc`). It creates cryptographically protected evidence receipts whenever an AI agent performs an important action — enabling independent, offline verification and tamper detection.

---

## 1. Problem & Solution

### The Fundamental Problem
Modern AI agents can execute real-world actions (e.g. issuing refunds, approving loan applications, modifying records, updating internal systems). Traditional logging only records what the application says happened:

```text
Agent: Refund Bot
Action: Refund
Amount: ₹4,500
Status: SUCCESS
```

If an insider, administrator, or attacker later alters `₹4,500` to `₹45,000` in the database, ordinary logs offer no cryptographic way to prove the record was tampered with.

### The AgentProof Solution
AgentProof sits around the AI agent and creates a self-contained cryptographic evidence receipt (`cool.receipt.v2`). Sensitive data is stored as salted commitments rather than plaintext. The evidence is signed using hybrid post-quantum signatures (**ML-DSA-65** + **Ed25519**) and logged into an append-only RFC 6962 transparency log.

```text
Agent Action (₹4,500 Refund)
          │
          ▼
    Salted Commitments
          │
          ▼
 Hybrid Signatures (ML-DSA-65 + Ed25519)
          │
          ▼
   RFC 6962 Transparency Log
          │
          ▼
   Independent Verifier → ✓ VALID
          │
  [ Tamper Test: ₹4,500 → ₹45,000 ]
          │
          ▼
   Independent Verifier → ✕ INVALID (Tampering Detected)
```

---

## 2. System Architecture

```text
                     USER (BROWSER)
                          │
                          ▼
                  AGENTPROOF WEB UI
       (Overview · Agent Run · Evidence · Verify · Tamper)
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     POST /api/trigger POST /api/verify POST /api/tamper
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                 NEXT.JS SERVER API
                          │
                          ▼
                 CooL SDK (cool-nwc)
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
   OBSERVE              COMMIT             SIGN
(Agent Refund)    (Salted Hashes)    (ML-DSA-65+Ed25519)
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                        ATTEST
                 (Simulated Mode)
                          │
                          ▼
                        ANCHOR
                    (RFC 6962 Log)
                          │
                          ▼
                 EVIDENCE RECEIPT
                          │
                          ▼
                INDEPENDENT VERIFIER
```

---

## 3. CooL Lifecycle Stages

1. **OBSERVE**: Agent performs an action (e.g. refund of ₹4,500). CooL captures the event type and metadata.
2. **COMMIT**: Sensitive values (inputs/outputs) are represented through salted cryptographic commitments (`mh:sha256`), preserving data privacy.
3. **SIGN**: Evidence is signed with hybrid post-quantum signatures (**ML-DSA-65** FIPS 204 + **Ed25519**).
4. **ATTEST**: Runtime measurements and TEE attestation quotes are associated (reported honestly as `SIMULATED` when running without hardware TEE).
5. **ANCHOR**: Evidence is recorded into an append-only RFC 6962 Merkle log with inclusion proofs.
6. **VERIFY**: The standalone verifier checks 7 independent trust domains (`binding`, `signature`, `inclusion`, `witnesses`, `attestation`, `enclave`, `anchor`).

---

## 4. Key Features & Interactive Lab

- **Agent Execution Suite**: Run an AI Refund Agent processing a ₹4,500 refund with live 1-2 second animated pipeline execution.
- **Evidence Receipt**: Human-readable view, sensitive data privacy salted commitment breakdown, technical parameters, and raw JSON format.
- **Offline Verifier**: One-click verification evaluating all 7 trust domains.
- **Tamper Lab**: Live tamper experiment mutating evidence values (e.g. ₹4,500 → ₹45,000). Re-executes real CooL verifier to catch tampering (`✕ binding FAILED`, `✕ signature FAILED`).
- **Honest Security Model**: Explicitly distinguishes simulated attestation from hardware TEE quotes without faking security guarantees.

---

## 5. Local Setup & Running Instructions

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/YourOrg/AgentProof.git
cd AgentProof

# 2. Install dependencies (includes local cool-nwc SDK)
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Verification & Build Commands

```bash
# Type check and build Next.js application
npm run build

# Start production server
npm run start
```

---

## 7. Limitations & Future Roadmap

### Current Limitations
- Hackathon local environment runs in **Simulated Attestation Mode** (`mode: "simulated"`). Real hardware TEE attestation requires an Intel TDX / Phala dstack endpoint (`/var/run/dstack.sock`).

### Future Scope
- Production Intel TDX / Phala dstack hardware attestation integration.
- Compliance & Incident Evidence Export Packs.
- Multi-agent evidence chaining and enterprise policy enforcement.
- OpenTimestamps Bitcoin mainnet anchoring confirmations.

---

## 8. License

Apache-2.0 · Northwind Cipher Pvt. Ltd. / AgentProof Team
