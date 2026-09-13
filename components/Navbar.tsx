"use client";

import React from "react";
import { Shield, Cpu, FileCheck2, ShieldAlert, Sparkles, CheckCircle2, Sun, Moon, UploadCloud } from "lucide-react";

export type TabType = "overview" | "agent-run" | "evidence" | "verify" | "tamper-lab" | "document-upload";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  hasEvidence: boolean;
  isVerified: boolean;
  isTampered: boolean;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasEvidence,
  isVerified,
  isTampered,
  theme,
  setTheme,
}) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "agent-run", label: "1. Run Agent", icon: Cpu },
    {
      id: "evidence",
      label: "2. Evidence",
      icon: FileCheck2,
      badge: hasEvidence ? "Ready" : undefined,
    },
    {
      id: "verify",
      label: "3. Verify",
      icon: CheckCircle2,
      badge: isVerified ? "✓ Valid" : undefined,
    },
    {
      id: "tamper-lab",
      label: "4. Tamper Lab",
      icon: ShieldAlert,
      badge: isTampered ? "✕ Tampered" : undefined,
    },
    {
      id: "document-upload",
      label: "5. Upload Real File",
      icon: UploadCloud,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-background/90 backdrop-blur-md border-b border-slate-200 dark:border-surface-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab("overview")}
          >
            <div className="p-2 rounded-xl bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Agent<span className="text-primary-600 dark:text-primary-500">Proof</span>
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-slate-700 dark:text-slate-300">
                  CooL v3
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Verifiable Evidence Layer for AI Agents
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-surface p-1 rounded-xl border border-slate-200 dark:border-surface-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white dark:bg-surface-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-surface-border"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-surface-hover"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary-600 dark:text-primary-400" : ""}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        tab.id === "tamper-lab" && isTampered
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle & Engine Status */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-surface-hover transition-all"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Engine Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-surface-border text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">CooL SDK</span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">Simulated Mode</span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-1 border-t border-slate-200 dark:border-surface-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-surface-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
