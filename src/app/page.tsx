"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Shield, Zap, MessageSquare, TrendingUp, Clock, Star, Building2, HardHat, Hammer, ChevronDown } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: window.location.origin,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">LeadQualifier</span>
            <span className="text-[#f97316] text-xs bg-[#f97316]/10 px-2 py-0.5 rounded-full font-medium">For Roofers</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
          >
            {loading ? "Loading..." : "Get Started"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-white/70 mb-8">
              <HardHat className="w-4 h-4 text-[#f97316]" />
              Built for Roofing Contractors
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Stop Calling<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#fb923c]">Tire-Kickers</span>
              <br />
              Start Closing Jobs
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-10">
              Angi and HomeAdvisor sell your lead to 5 competitors at once, and half the calls you chase are a waste of time. 
              LeadQualifier qualifies every website lead 24/7 — asks the right questions, scores them instantly, and books 
              your calendar only with homeowners ready to sign.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-lg shadow-[#f97316]/25 transition-all inline-flex items-center gap-2 group"
              >
                {loading ? "Loading..." : "Start Your Free Trial"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3 text-sm text-white/40 mt-2 sm:mt-0">
                <CheckCircle className="w-4 h-4 text-green-500" />
                7 days free · No credit card
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Dashboard preview mockup */}
            <div className="bg-[#141414] rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white/30 text-xs ml-2">leadqualifier.app/dashboard</span>
                </div>
                <span className="text-[#f97316] text-xs font-medium bg-[#f97316]/10 px-3 py-1 rounded-full">LIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚨</span>
                    <div>
                      <div className="text-white font-semibold text-sm">John M. — Roof Replacement</div>
                      <div className="text-white/40 text-xs">Just now · Insurance claim · Emergency</div>
                    </div>
                  </div>
                  <div className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full">SCORE 96</div>
                </div>
                <div className="flex items-center justify-between bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <div className="text-white font-semibold text-sm">Sarah K. — Gutter Install</div>
                      <div className="text-white/40 text-xs">2h ago · Cash · Next week</div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full">SCORE 68</div>
                </div>
                <div className="flex items-center justify-between bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❄️</span>
                    <div>
                      <div className="text-white font-semibold text-sm">Tom R. — Inspection</div>
                      <div className="text-white/40 text-xs">1d ago · "Just wondering"</div>
                    </div>
                  </div>
                  <div className="bg-gray-500/10 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">SCORE 12</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Hot Leads", value: "3", color: "text-green-500" },
                    { label: "Warm", value: "7", color: "text-yellow-500" },
                    { label: "Cold", value: "2", color: "text-gray-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <div className={`text-2xl font-bold ${color}`}>{value}</div>
                      <div className="text-white/40 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow behind dashboard */}
            <div className="absolute -inset-20 bg-gradient-radial from-[#f97316]/10 to-transparent blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* THE PAIN (Diagnosis section — RevPartners style) */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#f97316] text-sm font-semibold tracking-[0.2em] mb-4">THE REAL COST OF ANGI</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">They&apos;re Bleeding You Dry</h2>
            <p className="text-white/50 text-lg mt-4 max-w-2xl mx-auto">
              Here&apos;s what every lead actually costs you through the big platforms.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {[
              { value: "$50–$300", label: "Per lead on Angi/HomeAdvisor", sub: "And your competitors get it too", icon: TrendingUp },
              { value: "50%+", label: "Are fake, wrong number, or tire-kickers", sub: "Every call is 15 minutes wasted", icon: Clock },
              { value: "$1,500+", label: "Per month for qualified leads", sub: "With zero ownership of the pipeline", icon: Shield },
            ].map(({ value, label, sub, icon: Icon }) => (
              <div key={label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] transition-colors">
                <Icon className="w-10 h-10 text-[#f97316] mb-4 opacity-80" />
                <div className="text-4xl font-bold text-white mb-2">{value}</div>
                <div className="text-white/70">{label}</div>
                <div className="text-white/30 text-sm mt-2">{sub}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <p className="text-white/40 text-sm mb-6">FROM REDDIT r/ROOFING</p>
              <blockquote className="text-white/80 text-lg leading-relaxed">
                &ldquo;Angi sells your info to 5 guys at once. The lead shows up and it&rsquo;s a bidding war for who can 
                do it cheapest. Never again.&rdquo;
              </blockquote>
              <div className="mt-6 text-sm text-white/30">— u/RoofMasterTX, 2.3k upvotes</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <p className="text-white/40 text-sm mb-6">PAIN POINT #1</p>
              <div className="text-white/80 text-lg leading-relaxed">
                <strong className="text-white">Every hour on the phone with a tire-kicker</strong> is an hour you&rsquo;re 
                not on a roof making $300. LeadQualifier eliminates that completely.
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-400 font-medium">Problem solved by automated qualification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#f97316] text-sm font-semibold tracking-[0.2em] mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">From Form Fill to Job Booked</h2>
            <p className="text-white/50 text-lg mt-4 max-w-2xl mx-auto">
              Three minutes of setup. All the leads you want — none of the junk.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Lead Submits",
                desc: "Homeowner fills a form on your website or Facebook page. LeadQualifier instantly engages them.",
                icon: MessageSquare,
              },
              {
                num: "02",
                title: "AI Qualifies Instantly",
                desc: "Our AI asks 5 questions — insurance or cash? timeline? budget? address? — scores them 0-100 in seconds.",
                icon: Zap,
              },
              {
                num: "03",
                title: "You Only Get Hot Leads",
                desc: "90+ scores auto-book your calendar. Warm leads get a follow-up sequence. Cold leads never bother you again.",
                icon: CheckCircle,
              },
            ].map(({ num, title, desc, icon: Icon }) => (
              <div key={num} className="group relative">
                <div className="absolute -inset-px bg-gradient-to-b from-[#f97316]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#141414] border border-white/10 rounded-2xl p-8">
                  <div className="text-5xl font-black text-white/5 mb-4">{num}</div>
                  <div className="w-12 h-12 bg-[#f97316]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#f97316]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#f97316] text-sm font-semibold tracking-[0.2em] mb-4">WHAT YOU GET</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Everything You Need to Fill Your Pipeline
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "24/7 AI Qualification", desc: "Never miss another after-hours lead. AI responds instantly day or night." },
              { icon: TrendingUp, title: "Lead Scoring Engine", desc: "Hot (90+) → Warm (60-89) → Cold. Know exactly who to call first." },
              { icon: MessageSquare, title: "Smart Questions", desc: "AI asks the right questions — insurance claim? timeline? budget? address? — so you don't have to." },
              { icon: Star, title: "Priority Dashboard", desc: "See every lead ranked by score. One glance and you know your day." },
              { icon: Building2, title: "Calendar Auto-Booking", desc: "Hot leads automatically book a time on your calendar. No phone tag." },
              { icon: Shield, title: "No Per-Lead Fees", desc: "$299 flat. Unlimited leads. Angi charges you per tire-kicker. We don't." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-colors">
                <Icon className="w-8 h-8 text-[#f97316] mb-4" />
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#f97316] text-sm font-semibold tracking-[0.2em] mb-4">PRICING</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Less Than 3 Angi Leads a Month
          </h2>
          <p className="text-white/50 text-lg mb-16 max-w-2xl mx-auto">
            No per-lead charges. No contracts. No hidden fees. Just qualified homeowners 
            ready to write a check.
          </p>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-b from-[#f97316]/10 to-transparent border border-[#f97316]/20 rounded-3xl p-10 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f97316] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                BEST VALUE
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-6xl font-bold text-white">$299</span>
                <span className="text-white/40 text-lg">/mo</span>
              </div>
              <p className="text-white/40 text-sm mb-8">Unlimited leads. 7-day free trial.</p>
              <ul className="text-left space-y-4 mb-10">
                {[
                  "Unlimited lead qualifications",
                  "AI scoring & prioritization",
                  "Auto-booking to your calendar",
                  "Lead dashboard with full history",
                  "Email & SMS alerts for hot leads",
                  "Cancel anytime, no contract",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-white/70">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-4 px-6 rounded-xl transition-all text-lg shadow-lg shadow-[#f97316]/25 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Start Free Trial"}
              </button>
              <p className="text-white/30 text-sm mt-4">Cancel anytime. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/40 text-sm font-semibold tracking-[0.2em] mb-4">READY TO STOP WASTING TIME?</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Your 7-Day Free Trial
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            No credit card. No commitment. Just a week of seeing what qualified leads actually look like.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-lg shadow-[#f97316]/25 transition-all disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Started Free →"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-white/30">
          <span>LeadQualifier by coremind.work</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}
