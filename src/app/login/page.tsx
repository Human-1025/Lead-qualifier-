"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailParam = searchParams?.get("email") || "";
  const registeredParam = searchParams?.get("registered") || "";
  const [email, setEmail] = useState(emailParam);

  // Auto-send magic link when coming from Stripe checkout (registered=true)
  useEffect(() => {
    if (registeredParam === "true" && emailParam && supabase && !sent) {
      setLoading(true);
      supabase.auth
        .signInWithOtp({
          email: emailParam,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        .then(({ error: err }) => {
          if (!err) setSent(true);
          else setError(err.message);
        })
        .catch((e) => setError(e?.message || "Failed"))
        .finally(() => setLoading(false));
    }
  }, [emailParam, registeredParam, sent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <div className="h-4 w-4 rounded-sm bg-primary" />
          </div>
          <CardTitle className="text-lg">LeadQualifier</CardTitle>
          <CardDescription>
            {sent
              ? "Check your email"
              : registeredParam === "true"
              ? "Payment received — check your email to continue"
              : "Sign in to your dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-10 w-10 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Magic link sent to <strong>{email}</strong>. Click the link in your email to sign in.
              </p>
              {registeredParam === "true" && (
                <p className="text-xs text-muted-foreground/60">
                  You&apos;ll be taken to your onboarding wizard to complete setup.
                </p>
              )}
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="you@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
              <p className="text-[10px] text-muted-foreground/60 text-center">
                No password needed. We&apos;ll email you a secure login link.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
