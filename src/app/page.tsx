"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight, CheckCircle, Zap, TrendingUp, MessageSquare,
  Star, Building2, Shield, Clock, Menu, X, HardHat, ChevronDown,
  FileText, Calculator, BookOpen, Phone, BarChart3
} from "lucide-react"

// ─── Animations ───
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const } }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
}

function SectionHeader({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className="text-center"
    >
      <motion.div variants={fadeUp}>
        <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">{label}</Badge>
      </motion.div>
      <motion.h2 variants={fadeUp} className="text-3xl font-medium tracking-tight md:text-4xl">{title}</motion.h2>
      {description && <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">{description}</motion.p>}
    </motion.div>
  )
}

function FadeInView({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" as const } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Data ───
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
  { icon: BarChart3, name: "Monthly Lead Review", value: "$599", desc: "We analyze your pipeline every month and optimize your qualification — like having a marketing agency for $0." },
]

const FAQ = [
  { q: "How is this different from Angi or HomeAdvisor?", a: "Angi charges $50–$300 per lead and sells the same lead to 3–5 of your competitors. LeadQualifier is $299 flat for unlimited leads — and every lead is yours exclusively. No bidding war, no per-lead fees, ever." },
  { q: "Do I need to install anything complicated?", a: "One code snippet on your website. Takes 5 minutes. If you don't want to do it, we'll do it for you on the VIP setup call — included free with your trial." },
  { q: "What if my website doesn't get much traffic?", a: "LeadQualifier works with any traffic level. Even 50 visitors/month can generate qualified leads. Plus you can add it to your Facebook page and Google Business Profile." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts. No hidden fees. No cancellation penalties. Cancel in one click from your dashboard." },
  { q: "Will this work for my type of roofing?", a: "Residential, commercial, insurance claims, new construction — the AI adapts to your business. Tell it what you do once, and it asks the right questions for your specific market." },
  { q: "What happens after the 7-day trial?", a: "If you've qualified at least one real lead (and you will), you decide if $299/mo is worth a pipeline that manages itself. If not, cancel. No questions. No awkward phone calls." },
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
  { number: "02", title: "AI Qualifies Instantly", desc: "AI asks five targeted questions — insurance or cash? budget? timeline? scope? — and scores the lead 0–100 in real time." },
  { number: "03", title: "You Close Deals", desc: "Hot leads (90+) auto-book your calendar. Warm leads get a follow-up. Cold leads never reach your phone. Your pipeline runs itself." },
]

const PAIN_POINTS = [
  { metric: "$50–$300", label: "Per lead on Angi / HomeAdvisor", sub: "And your competitors get the exact same lead", icon: TrendingUp },
  { metric: "50%+", label: "Are fake, wrong-number, or tire-kickers", sub: "Every call costs you 15 minutes of roofing time", icon: Clock },
  { metric: "$1,500+", label: "Per month for qualified leads", sub: "With zero ownership of your pipeline", icon: Shield },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMouse, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouse)
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Mouse-following ambient glow */}
      <motion.div
        className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)",
          x: mousePos.x - 300,
          y: mousePos.y - 300,
          transition: "x 0.3s ease-out, y 0.3s ease-out",
        }}
      />

      {/* NAV */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10"
                >
                  <div className="h-3 w-3 rounded-sm bg-primary" />
                </motion.div>
                <span className="text-sm font-medium tracking-tight">LeadQualifier</span>
              </div>
              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 text-muted-foreground font-normal">For Roofers</Badge>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item.label}</a>
              ))}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="default" onClick={handleCheckout} disabled={loading}>
                  {loading ? "Loading\u2026" : "Get Started"}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </motion.div>
            </nav>
            <button className="md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-6 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">{item.label}</a>
                ))}
                <Separator className="my-3" />
                <Button className="w-full" onClick={handleCheckout} disabled={loading}>Get Started</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10">
        {/* ==================== HERO ==================== */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
          {/* Cinematic background image */}
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0 z-0"
          >
            <img
              src="https://v3b.fal.media/files/b/0a9cb385/JkdzuC53mBcXI1zzRJJ5Y_e333fa66c0474c319548475c75a613c4.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
          </motion.div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-[1]" />

          {/* Ambient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-[1]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-[1]"
          />

          <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 flex items-center justify-center gap-3"
              >
                <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-normal border-primary/30 bg-background/50 backdrop-blur-sm">
                  <HardHat className="mr-1.5 h-3 w-3 text-primary" />Built for Roofing Contractors
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[1.05] tracking-tight"
              >
                Stop Calling{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary">
                  Tire-Kickers
                </span>
                <br />
                <span className="text-muted-foreground/80">Start Closing Jobs</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6 text-base text-muted-foreground/80 leading-relaxed max-w-xl mx-auto md:text-lg"
              >
                Angi sells your lead to five guys at once. Half your calls are people "just wondering."
                <span className="block mt-3 text-foreground/90 font-medium">
                  LeadQualifier qualifies every lead 24/7 — scores them, books the real ones, silences the noise. <span className="text-primary">$299 flat.</span>
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" onClick={handleCheckout} disabled={loading} className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  7 days free &middot; No credit card &middot; VIP setup included
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50"
              >
                <span className="line-through">Angi: $50&ndash;$300/lead</span>
                <span className="text-primary font-medium">&rarr; LeadQualifier: $299 flat</span>
              </motion.div>
            </div>

            {/* Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-16 md:mt-20 mx-auto max-w-5xl"
            >
              <div className="relative rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="ml-4 flex-1 max-w-[240px] rounded-md bg-muted/50 px-3 py-1.5">
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
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-4 hover:bg-muted/30 transition-all hover:border-primary/20"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{lead.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{lead.name}</div>
                          <div className="text-xs text-muted-foreground/70 truncate">{lead.meta}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`shrink-0 ml-3 text-xs font-semibold ${
                        lead.score >= 90 ? "border-primary/30 text-primary bg-primary/5"
                        : lead.score >= 60 ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                        : "border-border/50 text-muted-foreground"}`}>
                        SCORE {lead.score}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-border/50 bg-muted/20">
                  <div className="grid grid-cols-3 divide-x divide-border/50">
                    {[
                      { label: "Hot Leads", value: "3", color: "text-primary" },
                      { label: "Warm", value: "7", color: "text-yellow-500" },
                      { label: "Cold", value: "2", color: "text-muted-foreground" },
                    ].map((stat) => (
                      <div key={stat.label} className="py-4 text-center">
                        <div className={`text-2xl font-semibold ${stat.color}`}>
                          <AnimatedCounter end={parseInt(stat.value)} />
                        </div>
                        <div className="text-xs text-muted-foreground/70">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== PAIN ==================== */}
        <section id="features" className="relative border-t border-border/50 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://v3b.fal.media/files/b/0a9cb385/klEG_tnirq2saJefVD-87_6f6584d752904f309bc96d27b2501b65.jpg" alt="" className="w-full h-full object-cover opacity-[0.04]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <SectionHeader
              label="THE REAL COST OF ANGI"
              title="They're Bleeding You Dry"
              description="Here's exactly what the big platforms are costing you."
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="mt-14 grid gap-4 md:grid-cols-3"
            >
              {PAIN_POINTS.map((item) => (
                <motion.div key={item.label} variants={scaleIn}>
                  <Card className="border-border/40 bg-card/50 backdrop-blur-sm h-full">
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
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <FadeInView>
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-4 text-[10px] tracking-wider">FROM REDDIT r/ROOFING &mdash; 2.3K UPVOTES</Badge>
                    <blockquote className="text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;Angi sells your info to 5 guys at once. The lead shows up and it&rsquo;s a bidding war for who can do it cheapest. Never again.&rdquo;
                    </blockquote>
                    <p className="mt-4 text-xs text-muted-foreground/50">&mdash; u/RoofMasterTX</p>
                  </CardContent>
                </Card>
              </FadeInView>
              <FadeInView delay={0.15}>
                <Card className="border-primary/20 bg-primary/[0.03] backdrop-blur-sm">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-4 text-[10px] tracking-wider">THE MATH &mdash; WHAT YOU'RE LOSING</Badge>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p><span className="text-foreground font-medium">20 hours/week</span> on cold calls &times; <span className="text-foreground font-medium">$150/hr</span> roofing rate</p>
                      <p className="text-lg font-semibold text-foreground">= $3,000/week in lost revenue</p>
                      <p className="text-xs">LeadQualifier eliminates every unqualified call. Forever. <span className="text-primary">$299 flat.</span></p>
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section id="how-it-works" className="relative border-t border-border/50 bg-muted/20 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://v3b.fal.media/files/b/0a9cb38c/a7kAuaxU_7TfTKgIDF5yH_73d8f37962d34ee88f1cae0fd14a0bee.png"
              alt=""
              className="w-full h-full object-cover opacity-[0.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background/95 to-muted/20" />
          </div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <SectionHeader
              label="HOW IT WORKS"
              title="From Form Fill to Job Booked"
              description="Three steps. Five-minute setup. Your pipeline runs itself."
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="mt-14 grid gap-6 md:grid-cols-3"
            >
              {STEPS.map((step) => (
                <motion.div key={step.number} variants={scaleIn}>
                  <Card className="border-border/40 bg-card/50 backdrop-blur-sm relative overflow-hidden group h-full">
                    <div className="absolute -top-6 -right-6 text-6xl font-bold text-muted/10 select-none group-hover:text-muted/20 transition-colors">{step.number}</div>
                    <CardHeader>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm">
                        <span className="text-xs font-semibold text-muted-foreground">{step.number}</span>
                      </div>
                      <CardTitle className="text-base font-medium">{step.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{step.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== FEATURES ==================== */}
        <section className="relative border-t border-border/50 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://v3b.fal.media/files/b/0a9cb38e/cFtTJTaDJA9zhLwdJjQYd_cd80c4af07ed41468378a5098e319dce.jpg"
              alt=""
              className="w-full h-full object-cover opacity-[0.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <SectionHeader
              label="EVERYTHING YOU GET"
              title="Fill Your Pipeline on Autopilot"
              description="No CRM setup. No training. No daily work. Just more jobs closed."
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              className="mt-14 grid gap-px bg-border/30 overflow-hidden rounded-xl md:grid-cols-3"
            >
              {FEATURES.map((feature) => (
                <motion.div key={feature.title} variants={fadeUp} className="bg-card/60 backdrop-blur-sm p-6 md:p-8 hover:bg-card/80 transition-colors">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== BONUSES ==================== */}
        <section className="relative border-t border-border/50 bg-muted/10 py-24 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <SectionHeader
              label="YOUR FREE BONUSES &mdash; $1,987 VALUE"
              title="Skip the Learning Curve"
              description="These aren't fluff PDFs. Every bonus was built to save you hours and close more jobs. Included free with your trial."
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {BONUSES.map((bonus) => (
                <motion.div key={bonus.name} variants={scaleIn}>
                  <Card className="border-border/40 bg-card/50 backdrop-blur-sm h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <bonus.icon className="h-4 w-4 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/[0.03]">{bonus.value}</Badge>
                      </div>
                      <CardTitle className="text-sm font-medium mt-3">{bonus.name}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">{bonus.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <FadeInView delay={0.3} className="mt-8 text-center">
              <Badge variant="secondary" className="text-[10px] px-3 py-1 backdrop-blur-sm">
                Total bonus value: $1,987 &middot; Included free when you start your trial
              </Badge>
            </FadeInView>
          </div>
        </section>

        {/* ==================== PRICING ==================== */}
        <section id="pricing" className="relative border-t border-border/50 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://v3b.fal.media/files/b/0a9cb38d/35B7UIOprn5gpRrykbkyx_d95f254eb2a84f5095e6b0fd8643a5fe.jpg"
              alt=""
              className="w-full h-full object-cover opacity-[0.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <SectionHeader
              label="PRICING"
              title="Less Than 3 Angi Leads a Month"
              description="No per-lead charges. No contracts. No hidden fees. Just qualified homeowners ready to write a check."
            />

            <FadeInView>
              <div className="mt-10 mx-auto max-w-lg text-center">
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-4">
                    <div className="text-xs text-muted-foreground/60 mb-1">Angi / HomeAdvisor</div>
                    <div className="text-lg font-semibold text-muted-foreground/50 line-through">$50&ndash;$300/lead</div>
                    <div className="text-[10px] text-muted-foreground/40 mt-1">Sold to 5 competitors</div>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/[0.04] backdrop-blur-sm p-4">
                    <div className="text-xs text-primary/80 font-medium mb-1">LeadQualifier</div>
                    <div className="text-lg font-semibold text-foreground">$299/mo</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1">Unlimited leads. Exclusive.</div>
                  </div>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.15}>
              <div className="mx-auto max-w-sm">
                <Card className="relative border-primary/30 bg-card/60 backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Badge className="rounded-full px-4 py-1 text-[10px] shadow-lg">BEST VALUE</Badge>
                  </div>
                  <CardHeader className="text-center">
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-medium tracking-tight">$299</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    <CardDescription>Unlimited leads &middot; 7-day free trial</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Separator className="bg-border/30" />
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
                        <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Separator className="bg-border/30" />
                    <div className="rounded-lg bg-primary/[0.03] border border-primary/10 p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">+ $1,987 in bonuses</span> included free
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">Response scripts, calculator, claims guide, VIP setup, monthly review</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full shadow-lg shadow-primary/20" size="lg" onClick={handleCheckout} disabled={loading}>
                        {loading ? "Loading\u2026" : "Start Free Trial"}
                      </Button>
                    </motion.div>
                    <p className="text-center text-xs text-muted-foreground/50">No credit card required. Cancel anytime.</p>
                  </CardContent>
                </Card>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="relative border-t border-border/50 bg-muted/10 py-24 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-3xl px-6 relative z-10">
            <SectionHeader
              label="QUESTIONS? WE'VE HEARD THEM ALL"
              title="Objections We Already Answered"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mt-14 space-y-2"
            >
              {FAQ.map((item, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/20 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{item.q}</span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground/60 shrink-0 ml-2" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 text-sm text-muted-foreground/80 leading-relaxed border-t border-border/30 pt-3">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="relative border-t border-border/50 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://v3b.fal.media/files/b/0a9cb385/JkdzuC53mBcXI1zzRJJ5Y_e333fa66c0474c319548475c75a613c4.jpg"
              alt=""
              className="w-full h-full object-cover opacity-[0.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </div>

          <div className="mx-auto max-w-2xl text-center px-6 relative z-10">
            <FadeInView>
              <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider">YOUR FIRST QUALIFIED LEAD IN UNDER 24 HOURS</Badge>
            </FadeInView>
            <FadeInView delay={0.1}>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">Start Your 7-Day Free Trial</h2>
            </FadeInView>
            <FadeInView delay={0.2}>
              <p className="mt-4 text-muted-foreground/80 max-w-md mx-auto">
                7 days free. No credit card. VIP setup included. If you have a website, you can start qualifying leads tonight — while you sleep.
              </p>
            </FadeInView>
            <FadeInView delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" onClick={handleCheckout} disabled={loading} className="shadow-lg shadow-primary/20">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground/50">
                <span>No credit card</span>
                <span className="text-muted-foreground/20">&middot;</span>
                <span>Cancel anytime</span>
                <span className="text-muted-foreground/20">&middot;</span>
                <span>VIP setup included</span>
              </div>
            </FadeInView>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <div className="h-2 w-2 rounded-sm bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground/60">LeadQualifier by coremind.work</span>
          </div>
          <span className="text-xs text-muted-foreground/40">&copy; 2026</span>
        </div>
      </footer>
    </div>
  )
}
