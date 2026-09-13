import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentProof — Verifiable Evidence Layer for AI Agents",
  description:
    "AgentProof creates cryptographically verifiable evidence for AI-agent actions using the CooL SDK. Move from trusting logs to verifying evidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${mono.variable}`}>
      <body className="bg-background text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
