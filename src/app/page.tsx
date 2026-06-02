"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CheckCircle, Zap, TrendingUp, MessageSquare, Star, Building2, Shield, Clock, Menu, X, HardHat } from "lucide-react"

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

const FEATURES = [
  {
    icon: Zap,
    title: "24/7 AI Qualification",
    description: "Never miss another after-hours lead. AI responds instantly, day or night, asking the right questions before you ever pick up the phone.",
  },
  {
    icon: TrendingUp,
    title: "Smart Lead Scoring",
    description: "Hot (90+), Warm (60-89), Cold. Every lead scored by buying intent. Know exactly who to call first.",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Questions",
    description: "AI asks the critical five — insurance claim? cash or finance? timeline? budget? address? — so you don't waste a single call.",
  },
  {
    icon: Star,
    title: "Priority Dashboard",
    description: "Every lead ranked by score. One glance and you know your entire day. No spreadsheets, no CRM setup.",
  },
  {
    icon: Building2,
    title: "Calendar Auto-Booking",
    description: "Hot leads automatically book a slot on your calendar. No phone tag, no back-and-forth texts.",
  },
  {
    icon: Shield,
    title: "Zero Per-Lead Costs",
    description: "$299 flat. Unlimited leads. Angi charges you per tire-kicker. We only win when you win.",
  },
]

const STEPS = [
  {
    number: "01",
    title: "Lead Submits",
    description: "Homeowner fills a form on your website, Facebook page, or Google Business Profile. LeadQualifier engages within seconds.",
  },
  {
    number: "02",
    title: "AI Qualifies Instantly",
    description: "Our AI asks five targeted questions — insurance or cash? budget range? timeline? scope of work? property address? — and scores the lead 0–100 in real time.",
  },
  {
    number: "03",
    title: "You Close Deals",
    description: "Hot leads (90+) auto-book your calendar. Warm leads get a follow-up sequence. Cold leads never reach your phone. Simple.",
  },
]

const PAIN_POINTS = [
  {
    metric: "$50–$300",
    label: "Per lead on Angi / HomeAdvisor",
    sub: "And your competitors get the exact same lead",
    icon: TrendingUp,
  },
  {
    metric: "50%+",
    label: "Are fake, wrong-number, or tire-kickers",
    sub: "Every call costs you 15 minutes you could be roofing",
    icon: Clock,
  },
  {
    metric: "$1,500+",
    label: "Per month for qualified leads",
    sub: "With zero ownership of your pipeline",
    icon: Shield,
  },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: window.location.origin,
        }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <div className="h-3 w-3 rounded-sm bg-primary" />
                </div>
                <span className="text-sm font-medium tracking-tight">LeadQualifier</span>
              </div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 text-muted-foreground font-normal">
                For Roofers
              </Badge>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Button size="default" onClick={handleCheckout} disabled={loading}>
                {loading ? "Loading…" : "Get Started"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Separator className="my-3" />
              <Button className="w-full" onClick={handleCheckout} disabled={loading}>
                {loading ? "Loading…" : "Get Started"}
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 flex items-center justify-center gap-3">
                <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-normal">
                  <HardHat className="mr-1.5 h-3 w-3 text-primary" />
                  Built for Roofing Contractors
                </Badge>
              </div>

              <h1 className="text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Stop Calling{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Tire-Kickers
                </span>
                <br />
                <span className="text-muted-foreground">Start Closing Jobs</span>
              </h1>

              <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto md:text-lg">
                Angi and HomeAdvisor sell your lead to five competitors at once. Half your calls are wasted on people 
                who were "just wondering." LeadQualifier qualifies every website lead 24/7 — scores them, books the 
                real ones, and silences the noise.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={handleCheckout} disabled={loading} className="w-full sm:w-auto">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  7 days free · No credit card · Cancel anytime
                </div>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="mt-20 mx-auto max-w-5xl">
              <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="ml-4 flex-1 max-w-[240px] rounded-md bg-muted px-3 py-1.5">
                    <span className="text-[11px] text-muted-foreground">leadqualifier.app/dashboard</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5 px-2 text-primary border-primary/30">
                    LIVE
                  </Badge>
                </div>

                {/* Dashboard content */}
                <div className="p-6 space-y-3">
                  {/* Lead rows */}
                  {[
                    { emoji: "🚨", name: "John M. — Roof Replacement", meta: "Just now · Insurance claim · Emergency", score: 96, color: "text-primary" },
                    { emoji: "⏳", name: "Sarah K. — Gutter Install", meta: "2h ago · Cash · Next week", score: 68, color: "text-yellow-500" },
                    { emoji: "❄️", name: "Tom R. — Inspection Only", meta: "1d ago · \"Just wondering\"", score: 12, color: "text-muted-foreground" },
                  ].map((lead, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{lead.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{lead.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{lead.meta}</div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ml-3 text-xs font-semibold ${
                          lead.score >= 90
                            ? "border-primary/30 text-primary"
                            : lead.score >= 60
                              ? "border-yellow-500/30 text-yellow-500"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        SCORE {lead.score}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Stats footer */}
                <div className="border-t border-border bg-muted/30">
                  <div className="grid grid-cols-3 divide-x divide-border">
                    {[
                      { label: "Hot Leads", value: "3", color: "text-primary" },
                      { label: "Warm", value: "7", color: "text-yellow-500" },
                      { label: "Cold", value: "2", color: "text-muted-foreground" },
                    ].map((stat) => (
                      <div key={stat.label} className="py-4 text-center">
                        <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN SECTION */}
        <section id="features" className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">
                THE REAL COST OF ANGI
              </Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                They're Bleeding You Dry
              </h2>
              <p className="mt-4 text-muted-foreground">
                Here's what every lead actually costs you through the big platforms.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {PAIN_POINTS.map((item) => (
                <Card key={item.label} className="border-border/60">
                  <CardHeader>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-medium tracking-tight">{item.metric}</CardTitle>
                    <CardDescription className="text-sm">{item.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground/60">{item.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4 text-[10px] tracking-wider">
                    FROM REDDIT r/ROOFING
                  </Badge>
                  <blockquote className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;Angi sells your info to 5 guys at once. The lead shows up and it&rsquo;s a bidding 
                    war for who can do it cheapest. Never again.&rdquo;
                  </blockquote>
                  <p className="mt-4 text-xs text-muted-foreground/50">— u/RoofMasterTX, 2.3k upvotes</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4 text-[10px] tracking-wider">
                    THE MATH
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">Every hour on the phone with a tire-kicker</span>{' '}
                    is an hour you&rsquo;re not on a roof making $300. LeadQualifier eliminates that completely.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-primary/80 font-medium">Solved by automated AI qualification</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-t border-border bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">
                HOW IT WORKS
              </Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                From Form Fill to Job Booked
              </h2>
              <p className="mt-4 text-muted-foreground">
                Three steps. All the leads you want. None of the junk.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step) => (
                <Card key={step.number} className="border-border/60 relative overflow-hidden group">
                  <div className="absolute -top-6 -right-6 text-6xl font-bold text-muted/10 select-none group-hover:text-muted/20 transition-colors">
                    {step.number}
                  </div>
                  <CardHeader>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                      <span className="text-xs font-semibold text-muted-foreground">{step.number}</span>
                    </div>
                    <CardTitle className="text-base font-medium">{step.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">
                EVERYTHING YOU GET
              </Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                Fill Your Pipeline on Autopilot
              </h2>
              <p className="mt-4 text-muted-foreground">
                No CRM setup. No training. Just connect your website and go.
              </p>
            </div>

            <div className="mt-14 grid gap-px bg-border overflow-hidden rounded-xl md:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="bg-card p-6 md:p-8">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-t border-border bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">
                PRICING
              </Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                Less Than 3 Angi Leads a Month
              </h2>
              <p className="mt-4 text-muted-foreground">
                No per-lead charges. No contracts. No hidden fees. Just qualified homeowners ready to write a check.
              </p>
            </div>

            <div className="mt-14 mx-auto max-w-sm">
              <Card className="relative border-primary/30 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="rounded-full px-4 py-1 text-[10px]">
                    BEST VALUE
                  </Badge>
                </div>
                <CardHeader className="text-center">
                  <div className="mt-2 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-medium tracking-tight">$299</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <CardDescription>Unlimited leads · 7-day free trial</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <ul className="space-y-3">
                    {[
                      "Unlimited lead qualifications",
                      "AI scoring & prioritization",
                      "Auto-booking to your calendar",
                      "Lead dashboard with full history",
                      "Email & SMS alerts for hot leads",
                      "Cancel anytime, no contract",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                    {loading ? "Loading…" : "Start Free Trial"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground/60">
                    Cancel anytime. No questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center px-6">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">
              READY TO STOP WASTING TIME?
            </Badge>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              Start Your 7-Day Free Trial
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              No credit card. No commitment. Just a week of seeing what qualified leads actually look like — and how much time you've been wasting.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleCheckout} disabled={loading}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <div className="h-2 w-2 rounded-sm bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">LeadQualifier by coremind.work</span>
          </div>
          <span className="text-xs text-muted-foreground/50">&copy; 2026</span>
        </div>
      </footer>
    </div>
  )
}
