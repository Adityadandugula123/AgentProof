import React from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "verified" | "failed" | "simulated" | "pending" | "absent" | "active";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  };

  switch (status) {
    case "verified":
    case "active":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}
        >
          <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
          {label || (status === "active" ? "ACTIVE" : "VERIFIED")}
        </span>
      );

    case "failed":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}
        >
          <XCircle className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
          {label || "FAILED / INVALID"}
        </span>
      );

    case "simulated":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}
        >
          <AlertTriangle className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
          {label || "SIMULATED"}
        </span>
      );

    case "pending":
    case "absent":
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-800 text-slate-400 border border-slate-700 ${sizeClasses[size]}`}
        >
          <ShieldCheck className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
          {label || status.toUpperCase()}
        </span>
      );
  }
};
