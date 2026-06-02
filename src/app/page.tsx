"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight, CheckCircle, Zap, TrendingUp, MessageSquare,
  Star, Building2, Shield, Clock, Menu, X, HardHat, ChevronDown,
  FileText, Calculator, BookOpen, Phone, BarChart3
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

const BONUSES = [
  { icon: FileText, name: "The Never Waste a Lead Response Scripts", value: "$497", desc: "Done-for-you SMS templates that turn warm leads into booked jobs. Copy, paste, close." },
  { icon: Calculator, name: "Pipeline Priority Calculator", value: "$297", desc: "Know exactly how many qualified leads you need to hit your revenue goals — in 30 seconds." },
  { icon: BookOpen, name: "Roofer's Guide to Closing Insurance Claims", value: "$397", desc: "Position yourself as the go-to for insurance replacements. Double your average job size." },
  { icon: Phone, name: "VIP Setup Call", value: "$197", desc: "We install LeadQualifier on your website for you. Takes 15 minutes. Zero effort on your end." },
  { icon: BarChart3, name: "Monthly Lead Review", value: "$599", desc: "We analyze your pipeline every month and optimize your qualification." },
]

const FAQ = [
  { q: "How is this different from Angi or HomeAdvisor?", a: "Angi charges $50–$300 per lead and sells the same lead to 3–5 of your competitors. LeadQualifier is $299 flat for unlimited leads — and every lead is yours exclusively. No bidding war, no per-lead fees, ever." },
  { q: "Do I need to install anything complicated?", a: "One code snippet on your website. Takes 5 minutes. If you don't want to do it, we'll do it for you on the VIP setup call — included free with your trial." },
  { q: "What if my website doesn't get much traffic?", a: "LeadQualifier works with any traffic level. Even 50 visitors/month can generate qualified leads. Plus you can add it to your Facebook page and Google Business Profile." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts. No hidden fees. No cancellation penalties. Cancel in one click from your dashboard." },
  { q: "Will this work for my type of roofing?", a: "Residential, commercial, insurance claims, new construction — the AI adapts to your business. Tell it what you do once." },
  { q: "What happens after the 7-day trial?", a: "If you've qualified at least one real lead (and you will), you decide if $299/mo is worth a pipeline that manages itself. If not, cancel. No questions." },
]

const FEATURES = [
  { icon: Zap, title: "24/7 AI Qualification", desc: "Never waste another minute on tire-kickers. AI answers every lead instantly — day or night — asking the right questions before you ever pick up the phone." },
  { icon: TrendingUp, title: "Smart Lead Scoring", desc: "Hot (90+), Warm (60–89), Cold. Every lead scored by buying intent. You know exactly who to call first, every time." },
  { icon: MessageSquare, title: "Intelligent Questions", desc: "AI asks the critical five — insurance claim? cash or finance? timeline? budget? address? — so you don't have to waste a single call finding out." },
  { icon: Star, title: "Priority Dashboard", desc: "Your entire pipeline at one glance. Every lead ranked by score. No spreadsheets, no CRM setup, no training needed." },
  { icon: Building2, title: "Calendar Auto-Booking", desc: "Hot leads automatically book a time on your calendar. No phone tag. No back-and-forth texts. They book, you show up, you close." },
  { icon: Shield, title: "Zero Per-Lead Fees", desc: "$299 flat. Unlimited leads. Angi charges you per tire-kicker. We only win when you win." },
]

const STEPS = [
  { number: "01", title: "Lead Submits", desc: "Homeowner fills a form on your website, Facebook page, or Google Business Profile. LeadQualifier engages within 3 seconds — even at 2am." },
  { number: "02", title: "AI Qualifies Instantly", desc: "AI asks five targeted questions and scores the lead 0–100 in real time. Hot, warm, or cold — you know instantly." },
  { number: "03", title: "You Close Deals", desc: "Hot leads (90+) auto-book your calendar. Warm leads get a follow-up sequence. Cold leads never reach your phone." },
]

const PAIN_POINTS = [
  { metric: "$50–$300", label: "Per lead on Angi / HomeAdvisor", sub: "And your competitors get the exact same lead", icon: TrendingUp },
  { metric: "50%+", label: "Are fake, wrong-number, or tire-kickers", sub: "Every call costs you 15 minutes you could be roofing at $150/hr", icon: Clock },
  { metric: "$1,500+", label: "Per month for qualified leads", sub: "With zero ownership of your pipeline or customer relationship", icon: Shield },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

      {/* NAV */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <div className="h-3 w-3 rounded-sm bg-primary" />
                </div>
                <span className="text-sm font-medium tracking-tight">LeadQualifier</span>
              </div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 text-muted-foreground font-normal">For Roofers</Badge>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item.label}</a>
              ))}
              <Button size="default" onClick={handleCheckout} disabled={loading}>
                {loading ? "Loading\u2026" : "Get Started"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </nav>
            <button className="md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">{item.label}</a>
              ))}
              <Separator className="my-3" />
              <Button className="w-full" onClick={handleCheckout} disabled={loading}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://v3b.fal.media/files/b/0a9cb35a/OTYYlwaSZ06N0EEzr1ZIP_f9662327b80b4f3584e5bfeb41fbb24e.jpg"
              alt=""
              className="w-full h-full object-cover opacity-[0.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>

          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 flex items-center justify-center gap-3">
                <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-normal">
                  <HardHat className="mr-1.5 h-3 w-3 text-primary" />Built for Roofing Contractors
                </Badge>
              </div>

              <h1 className="text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Stop Calling{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Tire-Kickers
                </span>
                <br />
                <span className="text-muted-foreground">Start Closing Jobs</span>
              </h1>

              <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto md:text-lg">
                Angi sells your lead to five guys at once. Half your calls are people "just wondering."
                You're running a phone-answering service, not a roofing company.
                <span className="block mt-3 text-foreground/80 font-medium">
                  LeadQualifier qualifies every lead 24/7 — scores them, books the real ones, silences the noise. <span className="text-primary">$299 flat.</span>
                </span>
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={handleCheckout} disabled={loading} className="w-full sm:w-auto">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  7 days free &middot; No credit card &middot; VIP setup included
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
                <span className="line-through">Angi: $50&ndash;$300/lead</span>
                <span className="text-primary font-medium">&rarr; LeadQualifier: $299 flat</span>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="mt-20 mx-auto max-w-5xl">
              <div className="relative rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="ml-4 flex-1 max-w-[240px] rounded-md bg-muted px-3 py-1.5">
                    <span className="text-[11px] text-muted-foreground">leadqualifier.app/dashboard</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5 px-2 text-primary border-primary/30">LIVE</Badge>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { emoji: "\uD83D\uDEA8", name: "John M. \u2014 Roof Replacement", meta: "Just now \u00B7 Insurance claim \u00B7 Emergency", score: 96, color: "text-primary" },
                    { emoji: "\u23F3", name: "Sarah K. \u2014 Gutter Install", meta: "2h ago \u00B7 Cash \u00B7 Next week", score: 68, color: "text-yellow-500" },
                    { emoji: "\u2744\uFE0F", name: "Tom R. \u2014 Inspection Only", meta: "1d ago \u00B7 \"Just wondering\"", score: 12, color: "text-muted-foreground" },
                  ].map((lead, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{lead.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{lead.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{lead.meta}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`shrink-0 ml-3 text-xs font-semibold ${
                        lead.score >= 90 ? "border-primary/30 text-primary"
                        : lead.score >= 60 ? "border-yellow-500/30 text-yellow-500"
                        : "border-border text-muted-foreground"}`}>
                        SCORE {lead.score}
                      </Badge>
                    </div>
                  ))}
                </div>
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

        {/* ==================== PAIN ==================== */}
        <section id="features" className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">THE REAL COST OF ANGI</Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">They're Bleeding You Dry</h2>
              <p className="mt-4 text-muted-foreground">Here's exactly what the big platforms are costing you.</p>
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
                  <Badge variant="secondary" className="mb-4 text-[10px] tracking-wider">FROM REDDIT r/ROOFING &mdash; 2.3K UPVOTES</Badge>
                  <blockquote className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;Angi sells your info to 5 guys at once. The lead shows up and it&rsquo;s a bidding war for who can do it cheapest. Never again.&rdquo;
                  </blockquote>
                  <p className="mt-4 text-xs text-muted-foreground/50">&mdash; u/RoofMasterTX</p>
                </CardContent>
              </Card>
              <Card className="border-border/60 border-primary/10 bg-primary/[0.02]">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4 text-[10px] tracking-wider">THE MATH &mdash; WHAT YOU'RE LOSING</Badge>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p><span className="text-foreground font-medium">20 hours/week</span> on cold calls &times; <span className="text-foreground font-medium">$150/hr</span> roofing rate</p>
                    <p className="text-lg font-semibold text-foreground">= $3,000/week in lost revenue</p>
                    <p className="text-xs">LeadQualifier eliminates every unqualified call. Forever. <span className="text-primary">$299 flat.</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section id="how-it-works" className="border-t border-border bg-muted/30 py-20 md:py-28 relative overflow-hidden">
          {/* Background feature image */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-[0.04] pointer-events-none">
            <img
              src="https://v3b.fal.media/files/b/0a9cb35a/MZR1vzx0szRjU0Nr4p0pD_f622fc1831d4422fa4551f9ad452b335.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">HOW IT WORKS</Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">From Form Fill to Job Booked</h2>
              <p className="mt-4 text-muted-foreground">Three steps. Five-minute setup. Your pipeline runs itself.</p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step) => (
                <Card key={step.number} className="border-border/60 relative overflow-hidden group">
                  <div className="absolute -top-6 -right-6 text-6xl font-bold text-muted/10 select-none group-hover:text-muted/20 transition-colors">{step.number}</div>
                  <CardHeader>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                      <span className="text-xs font-semibold text-muted-foreground">{step.number}</span>
                    </div>
                    <CardTitle className="text-base font-medium">{step.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{step.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FEATURES ==================== */}
        <section className="border-t border-border py-20 md:py-28 relative overflow-hidden">
          {/* Pipeline background image */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-[0.03] pointer-events-none">
            <img
              src="https://v3b.fal.media/files/b/0a9cb35b/5GlxrFMs_nnhIDNOEM06C_75a16af6875948a68eb983c5169c216f.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">EVERYTHING YOU GET</Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Fill Your Pipeline on Autopilot</h2>
              <p className="mt-4 text-muted-foreground">No CRM setup. No training. No daily work. Just more jobs closed.</p>
            </div>
            <div className="mt-14 grid gap-px bg-border overflow-hidden rounded-xl md:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="bg-card p-6 md:p-8">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BONUSES ==================== */}
        <section className="border-t border-border bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">YOUR FREE BONUSES &mdash; $1,987 VALUE</Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Skip the Learning Curve</h2>
              <p className="mt-4 text-muted-foreground">These aren't fluff PDFs. Every bonus was built to save you hours and close more jobs. <span className="text-primary font-medium">Included free with your trial.</span></p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {BONUSES.map((bonus) => (
                <Card key={bonus.name} className="border-border/60 relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <bonus.icon className="h-4 w-4 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">{bonus.value}</Badge>
                    </div>
                    <CardTitle className="text-sm font-medium mt-3">{bonus.name}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{bonus.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Badge variant="secondary" className="text-[10px] px-3 py-1">
                Total bonus value: $1,987 &middot; Included free when you start your trial
              </Badge>
            </div>
          </div>
        </section>

        {/* ==================== PRICING ==================== */}
        <section id="pricing" className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">PRICING</Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Less Than 3 Angi Leads a Month</h2>
              <p className="mt-4 text-muted-foreground">No per-lead charges. No contracts. No hidden fees. Just qualified homeowners ready to write a check.</p>
            </div>

            <div className="mt-10 mx-auto max-w-lg text-center">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Angi / HomeAdvisor</div>
                  <div className="text-lg font-semibold text-muted-foreground line-through">$50&ndash;$300/lead</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">Sold to 5 competitors</div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                  <div className="text-xs text-primary font-medium mb-1">LeadQualifier</div>
                  <div className="text-lg font-semibold text-foreground">$299/mo</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">Unlimited leads. Exclusive.</div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-sm">
              <Card className="relative border-primary/30 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="rounded-full px-4 py-1 text-[10px]">BEST VALUE</Badge>
                </div>
                <CardHeader className="text-center">
                  <div className="mt-2 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-medium tracking-tight">$299</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <CardDescription>Unlimited leads &middot; 7-day free trial</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <ul className="space-y-3">
                    {[
                      "Unlimited AI lead qualifications",
                      "Real-time scoring 0-100",
                      "Auto-booking to your calendar",
                      "Lead dashboard with full history",
                      "Email & SMS alerts for hot leads",
                      "VIP setup call included",
                      "Cancel anytime, no contract",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-medium">+ $1,987 in bonuses</span> included free
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Response scripts, calculator, claims guide, VIP setup, monthly review</p>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                    {loading ? "Loading\u2026" : "Start Free Trial"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground/60">No credit card required. Cancel anytime.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="border-t border-border bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">QUESTIONS? WE'VE HEARD THEM ALL</Badge>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Objections We Already Answered</h2>
            </div>
            <div className="space-y-2">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
                  <button
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/30 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center px-6">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">YOUR FIRST QUALIFIED LEAD IN UNDER 24 HOURS</Badge>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Start Your 7-Day Free Trial</h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              7 days free. No credit card. VIP setup included. If you have a website, you can start qualifying leads tonight — while you sleep.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleCheckout} disabled={loading}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground/60">
              <span>No credit card</span>
              <span className="text-muted-foreground/30">&middot;</span>
              <span>Cancel anytime</span>
              <span className="text-muted-foreground/30">&middot;</span>
              <span>VIP setup included</span>
            </div>
          </div>
        </section>
      </main>

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
