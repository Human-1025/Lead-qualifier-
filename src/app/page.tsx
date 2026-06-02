"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight, CheckCircle, Zap, TrendingUp, MessageSquare,
  Star, Building2, Shield, Clock, Menu, X, HardHat, ChevronDown,
  FileText, Calculator, BookOpen, Phone, BarChart3, Gauge,
  Sparkles, Target, BrainCircuit, Workflow, DollarSign, ArrowUpRight
} from "lucide-react"

// ─────────── Grain Texture CSS ───────────
// Applied via a global div with CSS filter noise

// ─────────── Animations ───────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
}
const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
}
const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}
const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

function FadeUp({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
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

function AnimatedCounter({ end, suffix = "", decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.max(1, Math.ceil(end / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end])

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>
}

// ─────────── Word-by-word reveal ───────────
function KineticText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ")
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + i * 0.04, ease: "easeOut" }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ─────────── Data ───────────
const NAV_ITEMS = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Compare", href: "#compare" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Pricing", href: "#pricing" },
]

const BONUSES = [
  { icon: FileText, name: "Response Scripts", value: "$497", desc: "SMS templates that turn warm leads into booked jobs." },
  { icon: Calculator, name: "Priority Calculator", value: "$297", desc: "Know how many leads you need to hit revenue goals." },
  { icon: BookOpen, name: "Insurance Claims Guide", value: "$397", desc: "Double your avg job size with insurance jobs." },
  { icon: Phone, name: "VIP Setup Call", value: "$197", desc: "We install LeadQualifier on your website for you." },
  { icon: BarChart3, name: "Monthly Review", value: "$599", desc: "We optimize your pipeline every month." },
]

const FAQ = [
  { q: "How is this different from Angi?", a: "Angi charges per lead and sells it to 5 guys. LeadQualifier is $299 flat for unlimited leads — all yours exclusively." },
  { q: "Is it hard to set up?", a: "One code snippet, 5 minutes. Or we do it for you on the VIP call." },
  { q: "What if my site has low traffic?", a: "Even 50 visitors/month can generate leads. Works on Facebook & Google too." },
  { q: "Can I cancel?", a: "Yes. One click. No contracts. No fees." },
  { q: "Will this work for my roofing type?", a: "Residential, commercial, insurance — the AI adapts to you." },
  { q: "What happens after the trial?", a: "If you've qualified a lead (and you will), decide if $299/mo is worth it. If not, cancel." },
]

// ─────────── Main Component ───────────
export default function Home() {
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.97])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
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
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* ── Grain Noise Overlay ── */}
      <div
        className="fixed inset-0 z-[999] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          mixBlendMode: "overlay" as const,
        }}
      />

      {/* ── Mouse-following ambient ── */}
      <motion.div
        className="fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          left: mousePos.x * 100 + "%",
          top: mousePos.y * 100 + "%",
          x: "-50%",
          y: "-50%",
          transition: "left 0.8s ease-out, top 0.8s ease-out",
        }}
      />

      {/* ── Animated Background Blob ── */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] pointer-events-none z-0 opacity-[0.03]">
        <svg viewBox="0 0 800 600" className="w-full h-full animate-[blob_12s_ease-in-out_infinite]">
          <defs>
            <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(16,185,129)" />
              <stop offset="100%" stopColor="rgb(6,182,212)" />
            </linearGradient>
          </defs>
          <path fill="url(#blobGrad)" d="M400,50 C550,50 750,100 750,300 C750,500 550,550 400,550 C250,550 50,500 50,300 C50,100 250,50 400,50 Z">
            <animate attributeName="d" dur="12s" repeatCount="indefinite" values="
              M400,50 C550,50 750,100 750,300 C750,500 550,550 400,550 C250,550 50,500 50,300 C50,100 250,50 400,50 Z;
              M400,30 C580,30 780,120 720,310 C660,500 540,580 400,570 C260,560 30,520 60,290 C90,60 220,30 400,30 Z;
              M400,70 C520,70 700,140 730,290 C760,440 580,530 400,530 C220,530 70,460 80,280 C90,100 280,70 400,70 Z;
              M400,50 C550,50 750,100 750,300 C750,500 550,550 400,550 C250,550 50,500 50,300 C50,100 250,50 400,50 Z
            "/>
          </path>
        </svg>
      </div>

      {/* ── NAV (app header style) ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <div className="h-3 w-3 rounded-sm bg-primary" />
              </div>
              <span className="text-sm font-medium">LeadQualifier</span>
              <div className="ml-2 flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-2.5 py-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-primary/70 font-medium">Live</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href}
                  className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors tracking-wide uppercase">{item.label}</a>
              ))}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" onClick={handleCheckout} disabled={loading}
                  className="shadow-lg shadow-primary/15">
                  {loading ? "Loading\u2026" : "Start Trial"}
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Button>
              </motion.div>
            </nav>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">{item.label}</a>
                ))}
                <Separator className="my-3" />
                <Button className="w-full" size="sm" onClick={handleCheckout} disabled={loading}>Start Trial</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10">
        {/* ════════════════════════════
             HERO — Bento Dashboard
           ════════════════════════════ */}
        <section id="dashboard" className="relative min-h-screen flex items-center pt-14 overflow-hidden">
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <img
              src="https://v3b.fal.media/files/b/0a9cb385/JkdzuC53mBcXI1zzRJJ5Y_e333fa66c0474c319548475c75a613c4.jpg"
              alt="" className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
          </motion.div>

          <div className="mx-auto max-w-7xl px-6 relative z-10 w-full py-16 md:py-24">
            {/* Bento Grid Hero */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              {/* ── Large left block: Headline + CTA (spans 7 cols) ── */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="md:col-span-7 flex flex-col justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6"
                >
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] border-primary/20 bg-background/50 backdrop-blur-sm">
                    <Sparkles className="mr-1 h-2.5 w-2.5 text-primary" />
                    AI-Powered Lead Qualification for Roofers
                  </Badge>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight">
                  <KineticText text="Stop paying" className="text-muted-foreground/60" delay={0.3} /><br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary font-medium"
                  >
                    per tire-kicker.
                  </motion.span><br />
                  <KineticText text="Start closing" className="text-muted-foreground/60" delay={0.6} /><br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="text-foreground font-medium"
                  >
                    qualified jobs.
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-6 text-sm text-muted-foreground/70 leading-relaxed max-w-md"
                >
                  Angi charges $50–$300 per lead and sells it to 5 guys at once. 
                  LeadQualifier is one flat price. Unlimited leads. All yours.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  className="mt-8 flex flex-col sm:flex-row items-start gap-4"
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" onClick={handleCheckout} disabled={loading}
                      className="shadow-xl shadow-primary/25 text-base">
                      {loading ? "Loading\u2026" : "Start 7-Day Free Trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/50 pt-2">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    No credit card &middot; VIP setup included
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Right block: Live Stats Widget (spans 5 cols) ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="md:col-span-5"
              >
                <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-6 md:p-8 h-full flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Live Stats</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] px-2 border-primary/20 text-primary/70 bg-primary/[0.03]">
                      <Gauge className="h-2.5 w-2.5 mr-1" /> Real-time
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-1">Leads qualified today</div>
                      <div className="text-4xl md:text-5xl font-light text-foreground">
                        <AnimatedCounter end={47} /> <span className="text-lg text-muted-foreground/40">/ 52</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-3 w-3 text-primary" />
                        <span className="text-[10px] text-primary">+12% vs yesterday</span>
                      </div>
                    </div>

                    <Separator className="bg-border/30" />

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Hot (90+)", value: "12", color: "text-primary", bar: "w-3/4" },
                        { label: "Warm (60-89)", value: "24", color: "text-yellow-500", bar: "w-1/2" },
                        { label: "Cold", value: "11", color: "text-muted-foreground", bar: "w-1/4" },
                      ].map((s) => (
                        <div key={s.label}>
                          <div className={`text-lg font-medium ${s.color}`}>{s.value}</div>
                          <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">{s.label}</div>
                          <div className="mt-1.5 h-1 rounded-full bg-muted/30 overflow-hidden">
                            <div className={`h-full rounded-full ${s.color === "text-primary" ? "bg-primary/50" : s.color === "text-yellow-500" ? "bg-yellow-500/50" : "bg-muted-foreground/30"}`} style={{width: s.label === "Hot (90+)" ? "75%" : s.label === "Warm (60-89)" ? "50%" : "25%"}} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Bottom bar: Price anchor (spans full width) ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="md:col-span-12"
              >
                <div className="flex items-center justify-center gap-2 md:gap-4 text-xs text-muted-foreground/50 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20 w-fit mx-auto">
                  <span className="line-through text-muted-foreground/30">Angi: $50&ndash;$300/lead</span>
                  <span className="text-muted-foreground/20">|</span>
                  <span className="text-primary font-medium">LeadQualifier: $299/mo &mdash; unlimited</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
             COMPARE — Split Screen (Angi vs LQ)
           ════════════════════════════ */}
        <section id="compare" className="relative border-t border-border/30 py-24 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <FadeUp>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-3 text-[10px] tracking-widest">COMPARE</Badge>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Two roofers. <span className="text-muted-foreground/50">Same market.</span>
                </h2>
                <p className="text-xs text-muted-foreground/50 mt-3">One uses Angi. One uses LeadQualifier. The difference is $36,000/year.</p>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* ── Angi Side ── */}
              <FadeIn>
                <motion.div whileHover={{ scale: 1.01 }} className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6 md:p-8 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <Badge variant="outline" className="text-[10px] border-red-500/20 text-red-500/60 bg-red-500/[0.03] mb-4">THE ANGI ROOFER</Badge>
                    <div className="space-y-4">
                      {[
                        "Pays $50-$300 per lead",
                        "Lead sold to 5 competitors",
                        "50%+ calls are tire-kickers",
                        "20 hrs/week on cold calls",
                        "Owns zero pipeline",
                        "$36,000+ / year for junk leads",
                      ].map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="flex items-center gap-3 text-sm text-muted-foreground/60"
                        >
                          <div className="h-1 w-1 rounded-full bg-red-500/40" />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-red-500/10">
                      <div className="text-3xl font-light text-red-500/40">-$36k<span className="text-sm text-red-500/20">/yr</span></div>
                      <div className="text-[10px] text-red-500/20 mt-1">Lost revenue + wasted time</div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>

              {/* ── LeadQualifier Side ── */}
              <FadeIn>
                <motion.div whileHover={{ scale: 1.01 }} className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 md:p-8 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/[0.03] mb-4">THE LEADQUALIFIER ROOFER</Badge>
                    <div className="space-y-4">
                      {[
                        "Pays $299/mo — unlimited leads",
                        "Every lead is yours exclusively",
                        "AI qualifies 100% of leads",
                        "0 hrs/week on tire-kickers",
                        "Owns the full pipeline",
                        "$3,588 / year for unlimited qualified leads",
                      ].map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="flex items-center gap-3 text-sm text-muted-foreground/80"
                        >
                          <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-primary/20">
                      <div className="text-3xl font-light text-primary">+$32k<span className="text-sm text-primary/40">/yr</span></div>
                      <div className="text-[10px] text-primary/40 mt-1">Saved vs Angi + reclaimed time</div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            </div>

            {/* Social proof row */}
            <FadeUp delay={0.2} className="mt-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-5">
                  <Badge variant="secondary" className="mb-3 text-[9px] tracking-widest">FROM REDDIT r/ROOFING</Badge>
                  <blockquote className="text-sm text-muted-foreground/70 leading-relaxed italic">
                    &ldquo;Angi sells your info to 5 guys at once. The lead shows up and it&rsquo;s a bidding war. Never again.&rdquo;
                  </blockquote>
                  <p className="text-xs text-muted-foreground/40 mt-3">&mdash; u/RoofMasterTX &middot; 2.3k upvotes</p>
                </div>
                <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-5">
                  <Badge variant="secondary" className="mb-3 text-[9px] tracking-widest">THE MATH</Badge>
                  <p className="text-sm text-muted-foreground/70">
                    20 hrs/week on cold calls &times; $150/hr roofing rate = <span className="text-foreground font-medium">$3,000/week</span> lost.
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-3">LeadQualifier eliminates every unqualified call. <span className="text-primary">$299 flat.</span></p>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════
             PIPELINE — How It Works (visual flow)
           ════════════════════════════ */}
        <section id="pipeline" className="relative border-t border-border/30 py-24 md:py-32 overflow-hidden bg-muted/10">
          <div className="mx-auto max-w-7xl px-6">
            <FadeUp>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-3 text-[10px] tracking-widest">PIPELINE</Badge>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  From <span className="text-muted-foreground/50">click</span> to{" "}
                  <span className="text-primary">closed</span>
                </h2>
                <p className="text-xs text-muted-foreground/50 mt-3">Three stages. Zero effort. Your pipeline runs itself.</p>
              </div>
            </FadeUp>

            <div className="relative">
              {/* Pipeline connecting line */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border/30 to-transparent -translate-y-1/2" />

              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                variants={stagger}
                className="grid md:grid-cols-3 gap-6"
              >
                {[
                  { num: "01", icon: Workflow, title: "Lead Lands", desc: "Homeowner fills a form on your site, Facebook, or Google. LeadQualifier engages in under 3 seconds — even at 2 AM." },
                  { num: "02", icon: BrainCircuit, title: "AI Qualifies", desc: "Our AI asks 5 targeted questions and scores the lead 0-100 in real time. Insurance claim? Cash? Budget? Timeline? Done." },
                  { num: "03", icon: Target, title: "You Close", desc: "Hot leads (90+) auto-book your calendar. Warm leads get sequenced. Cold leads vanish. You only talk to buyers." },
                ].map((step) => (
                  <motion.div key={step.num} variants={scaleUp} className="relative">
                    <div className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 md:p-8 h-full relative overflow-hidden group">
                      <div className="absolute -top-6 -right-6 text-7xl font-bold text-muted/5 select-none">{step.num}</div>
                      <div className="relative">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground/60 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Feature Bento (3x2 grid mixing content types) */}
            <FadeUp delay={0.3} className="mt-10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Zap, title: "24/7 AI", desc: "Never miss a lead, day or night", span: "col-span-1" },
                  { icon: TrendingUp, title: "Smart Scoring", desc: "Hot, warm, cold — at a glance", span: "col-span-1" },
                  { icon: MessageSquare, title: "5 Key Questions", desc: "Insurance, budget, timeline, scope, address", span: "col-span-1" },
                  { icon: Star, title: "One-Glance Dashboard", desc: "Your entire pipeline, ranked by score", span: "col-span-1" },
                  { icon: Building2, title: "Auto-Booking", desc: "Hot leads book themselves. You just show up.", span: "col-span-1" },
                  { icon: Shield, title: "Zero Per-Lead Fees", desc: "$299 flat. Angi charges per tire-kicker.", span: "col-span-1" },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm p-4 hover:bg-card/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <f.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">{f.title}</div>
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5">{f.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════
             BONUSES WIDGET
           ════════════════════════════ */}
        <section className="relative border-t border-border/30 py-24 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <FadeUp>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-3 text-[10px] tracking-widest">BONUSES &mdash; $1,987 VALUE</Badge>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Skip the <span className="text-primary">learning curve</span>
                </h2>
                <p className="text-xs text-muted-foreground/50 mt-3">Everything you need to start closing more jobs. <span className="text-primary/80">Included free.</span></p>
              </div>
            </FadeUp>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid md:grid-cols-5 gap-3"
            >
              {BONUSES.map((b) => (
                <motion.div key={b.name} variants={scaleUp}>
                  <div className="rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <b.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/60">{b.value}</Badge>
                    </div>
                    <div className="text-xs font-medium mb-1">{b.name}</div>
                    <div className="text-[10px] text-muted-foreground/60 leading-relaxed flex-1">{b.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <FadeUp delay={0.2} className="mt-6 text-center">
              <Badge variant="secondary" className="text-[9px] px-3 py-1">
                Total: $1,987 &middot; Free with trial
              </Badge>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════
             PRICING — Settings-style toggle
           ════════════════════════════ */}
        <section id="pricing" className="relative border-t border-border/30 py-24 md:py-32 overflow-hidden bg-muted/10">
          <div className="mx-auto max-w-7xl px-6">
            <FadeUp>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-3 text-[10px] tracking-widest">PRICING</Badge>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Less than <span className="text-muted-foreground/50">3 Angi leads</span>
                </h2>
                <p className="text-xs text-muted-foreground/50 mt-3">No per-lead charges. No contracts. Just leads you actually want.</p>
              </div>
            </FadeUp>

            {/* Price anchor — settings-style toggle */}
            <FadeUp>
              <div className="mx-auto max-w-lg mb-8">
                <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Current setup</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/60 bg-primary/[0.03]">Switch</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/20 bg-background/40 p-3 opacity-60">
                      <div className="text-[10px] text-muted-foreground/50 mb-1">Angi / HomeAdvisor</div>
                      <div className="text-base font-medium text-muted-foreground/50 line-through">$50&ndash;$300/lead</div>
                      <div className="text-[9px] text-muted-foreground/30 mt-1">Sold to 5 competitors</div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-3 shadow-sm">
                      <div className="text-[10px] text-primary/70 mb-1">LeadQualifier</div>
                      <div className="text-base font-medium">$299/mo</div>
                      <div className="text-[9px] text-muted-foreground/50 mt-1">Unlimited &middot; Exclusive</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mx-auto max-w-sm">
                <div className="rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-md p-6 md:p-8 shadow-xl relative overflow-hidden">
                  {/* Glow top */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px]" />
                  
                  <div className="relative">
                    <div className="text-center mb-6">
                      <Badge className="rounded-full px-3 py-1 text-[9px] mb-3">BEST VALUE</Badge>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-light tracking-tight">$299</span>
                        <span className="text-sm text-muted-foreground/50">/mo</span>
                      </div>
                      <div className="text-xs text-muted-foreground/50 mt-1">Unlimited leads &middot; 7-day free trial</div>
                    </div>

                    <Separator className="bg-border/20" />

                    <ul className="space-y-2.5 my-5">
                      {[
                        "Unlimited AI lead qualifications",
                        "Real-time scoring 0-100",
                        "Auto-booking to your calendar",
                        "Lead dashboard with full history",
                        "Email & SMS alerts",
                        "VIP setup call included",
                        "Cancel anytime — no contract",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground/70">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Separator className="bg-border/20" />

                    <div className="rounded-lg bg-primary/[0.03] border border-primary/10 p-3 my-5 text-center">
                      <p className="text-[10px] text-muted-foreground/60">
                        + <span className="text-primary/80 font-medium">$1,987 in bonuses</span> included
                      </p>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full shadow-lg shadow-primary/20" size="lg" onClick={handleCheckout} disabled={loading}>
                        {loading ? "Loading\u2026" : "Start Free Trial"}
                      </Button>
                    </motion.div>
                    <p className="text-center text-[10px] text-muted-foreground/40 mt-3">No credit card required</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════
             FAQ
           ════════════════════════════ */}
        <section className="relative border-t border-border/30 py-24 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-3xl px-6">
            <FadeUp>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-3 text-[10px] tracking-widest">FAQ</Badge>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Objections <span className="text-muted-foreground/50">answered</span>
                </h2>
              </div>
            </FadeUp>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="space-y-2"
            >
              {FAQ.map((item, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between px-5 py-3.5 text-left text-xs font-medium hover:bg-muted/20 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{item.q}</span>
                      <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 ml-2" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden">
                          <div className="px-5 pb-3.5 text-xs text-muted-foreground/60 leading-relaxed border-t border-border/20 pt-3">
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

        {/* ════════════════════════════
             FINAL CTA
           ════════════════════════════ */}
        <section className="relative border-t border-border/30 py-24 md:py-32 overflow-hidden bg-muted/10">
          <div className="mx-auto max-w-2xl text-center px-6">
            <FadeUp>
              <Badge variant="secondary" className="mb-3 text-[10px] tracking-widest">YOUR FIRST QUALIFIED LEAD IN UNDER 24 HOURS</Badge>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">Start qualifying leads <span className="text-primary">tonight</span></h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-4 text-sm text-muted-foreground/60 max-w-md mx-auto">
                7 days free. No credit card. VIP setup included. If you have a website, you can start qualifying leads tonight — while you sleep.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="mt-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Button size="lg" onClick={handleCheckout} disabled={loading}
                    className="shadow-xl shadow-primary/25 text-base">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground/40 mt-4">
                  <span>No credit card</span>
                  <span>&middot;</span>
                  <span>Cancel anytime</span>
                  <span>&middot;</span>
                  <span>VIP setup included</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/30">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <div className="h-2 w-2 rounded-sm bg-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground/50">LeadQualifier by coremind.work</span>
          </div>
          <span className="text-[10px] text-muted-foreground/30">&copy; 2026</span>
        </div>
      </footer>

      {/* ── Global Blob Animation Keyframes ── */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(5deg); }
          66% { transform: scale(0.9) rotate(-3deg); }
        }
      `}</style>
    </div>
  )
}

// ── FadeIn helper for the compare section ──
function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
