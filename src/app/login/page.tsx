"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
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
            {sent ? "Check your email" : "Sign in to your dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-10 w-10 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Magic link sent to <strong>{email}</strong>. Click the link in your email to sign in.
              </p>
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
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                <Mail className="mr-2 h-4 w-4" />
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
              <p className="text-[10px] text-muted-foreground/60 text-center">
                No password needed. We'll email you a secure login link.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
