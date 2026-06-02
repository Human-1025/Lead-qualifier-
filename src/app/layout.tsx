import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadQualifier — AI Lead Qualification for Roofing Contractors",
  description:
    "Stop wasting time on tire-kickers. Our AI qualifies every website lead instantly — asking the right questions, scoring them, and booking qualified jobs to your calendar.",
  openGraph: {
    title: "LeadQualifier",
    description: "AI that qualifies roofing leads before you pick up the phone.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
