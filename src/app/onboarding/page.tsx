"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { ArrowRight, CheckCircle, Copy, Code2, ChevronRight } from "lucide-react";

const STEPS = ["Business", "Questions", "Embed"];

// Default qualification questions
const DEFAULT_QUESTIONS = [
  "What type of work do you need? (Roof replacement, repair, inspection, gutters, other)",
  "Is this an insurance claim or paying out of pocket?",
  "What's your timeline? (Emergency/ASAP, this month, next month, just exploring)",
  "What's your approximate budget range? (Under $5K, $5K-$15K, $15K-$30K, $30K+)",
  "What's the property address so we can check service availability?",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const contractorId = "demo-contractor"; // Will come from Supabase user metadata in production

  const embedCode = `<script src="https://lead-qualifier-core-mind.vercel.app/widget.js" data-owner="${contractorId}"></script>`;

  const handleSave = async () => {
    setSaving(true);
    // In production: save to Supabase contractors table
    // For now, just simulate
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    router.push("/dashboard");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
              </div>
              <span className="text-xs font-medium">LeadQualifier Setup</span>
            </div>
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${i <= step ? "bg-primary" : "bg-muted-foreground/20"}`} />
                  <span className={`text-[9px] ${i <= step ? "text-primary" : "text-muted-foreground/40"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((step + 0.5) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-6 py-12 md:py-20">
        {/* Step 0: Business Info */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 text-[10px]">Step 1 of 3</Badge>
              <h1 className="text-2xl font-medium tracking-tight">Tell us about your business</h1>
              <p className="text-sm text-muted-foreground mt-2">
                This appears on your lead widget so customers know who they&apos;re talking to.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Business Name</label>
                <Input
                  placeholder="Your Roofing Company"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone Number</label>
                <Input
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={() => setStep(1)} disabled={!businessName} className="w-full">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 1: Configure Questions */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 text-[10px]">Step 2 of 3</Badge>
              <h1 className="text-2xl font-medium tracking-tight">Customize your qualification questions</h1>
              <p className="text-sm text-muted-foreground mt-2">
                The AI asks these when a lead fills out your widget. Pre-filled with roofing best practices.
              </p>
            </div>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  <Input
                    value={q}
                    onChange={(e) => {
                      const newQ = [...questions];
                      newQ[i] = e.target.value;
                      setQuestions(newQ);
                    }}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="w-full">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Embed Code */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 text-[10px]">Step 3 of 3</Badge>
              <h1 className="text-2xl font-medium tracking-tight">Add the widget to your site</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Paste this one line into your website&apos;s <code className="text-primary text-xs bg-primary/5 px-1 rounded">&lt;head&gt;</code> tag.
                First qualified leads arrive within 24 hours.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 relative">
              <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all font-mono">
                {embedCode}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-7 text-[10px]"
                onClick={copyCode}
              >
                {copied ? <CheckCircle className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="rounded-lg border border-border/30 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Where to paste it</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Add to your website builder (Wix, Squarespace, WordPress) or ask your web developer. Works on
                    Facebook pages and Google Business Profile too.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Finish Setup"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-[10px] text-muted-foreground/60 text-center">
              You can change these settings anytime from your dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
