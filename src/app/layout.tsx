import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadQualifier — AI Lead Qualification for Roofing Contractors",
  description:
    "Stop wasting time on tire-kickers. Our AI qualifies every website lead instantly — asking the right questions, scoring them, and booking qualified jobs to your calendar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
