import React from "react";
import { Shield, Github, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-surface-border bg-surface/50 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              <span className="font-bold text-white text-base tracking-tight font-mono">
                AGENT<span className="text-primary-500">PROOF</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              AgentProof creates cryptographically verifiable evidence for important AI-agent actions using the CooL SDK. Moving AI governance from unverified logs to offline-verifiable proof.
            </p>
            <div className="text-xs font-mono text-primary-400 pt-1">
              From &ldquo;trust the log&rdquo; to &ldquo;verify the evidence.&rdquo;
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Cryptographic Engine
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ML-DSA-65 Post-Quantum
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ed25519 Hybrid Signatures
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                RFC 6962 Transparency Log
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Simulated TEE Attestation
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/Northwind-Cipher/cool-sdk"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  Northwind-Cipher / cool-sdk
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li className="text-slate-400">cool-nwc v3.0.0 Engine</li>
              <li className="text-slate-400">Apache-2.0 Open Source</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 AgentProof • Powered by CooL SDK (Northwind Cipher)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>OBSERVE</span> → <span>COMMIT</span> → <span>SIGN</span> → <span>ATTEST</span> → <span>ANCHOR</span> → <span>VERIFY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
