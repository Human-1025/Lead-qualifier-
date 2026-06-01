"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Shield, Zap, MessageSquare } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero */}
      <section className="px-4 py-20 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          For Roofing Contractors
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Stop Wasting Time on Tire-Kickers.
          <br />
          <span className="text-orange-600">AI Qualifies Every Lead Instantly.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          LeadQualifier screens your website leads 24/7 — asking the right
          questions, scoring them, and booking qualified jobs straight to your
          calendar. You only talk to homeowners ready to sign.
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? "Loading..." : "Start Free Trial — $299/mo"}
          <ArrowRight className="inline ml-2 w-5 h-5" />
        </button>
        <p className="text-gray-400 text-sm mt-4">
          7-day free trial. Cancel anytime. No credit card shenanigans.
        </p>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Lead Fills Your Form",
              desc: "Homeowner submits a contact form on your website. LeadQualifier instantly engages.",
              icon: MessageSquare,
            },
            {
              step: "2",
              title: "AI Qualifies in Real-Time",
              desc: "Our AI asks 5-7 smart questions — insurance or cash? timeline? budget? — and scores every lead.",
              icon: Zap,
            },
            {
              step: "3",
              title: "Hot Leads Book Instantly",
              desc: "Qualified leads go straight to your calendar. Tire-kickers get a polite follow-up later.",
              icon: CheckCircle,
            },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div
              key={step}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-orange-600 font-bold text-sm mb-2">
                STEP {step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Pain */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            You Know the Problem
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Wasted Hours",
                desc: "50% of your website leads are tire-kickers, wrong service type, or just comparing prices. Every hour you spend calling them is an hour you're not on a roof making money.",
              },
              {
                title: "Leads Slip Through",
                desc: "You can't answer every form submission at 9pm on a Saturday. By Monday morning, that homeowner with a leaking roof already called your competitor.",
              },
              {
                title: "Angi & HomeAdvisor Are Bleeding You",
                desc: "$50-300 per lead, half are fake, and you're competing with 5 other roofers on the same lead. They own your pipeline.",
              },
              {
                title: "Your Reputation Is Everything",
                desc: "Every unanswered lead is a bad review waiting to happen. Fast, professional response = 5-star reviews and referrals.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          One Plan. Unlimited Leads. No Per-Lead Fees.
        </h2>
        <div className="bg-white border-2 border-orange-600 rounded-2xl p-10 max-w-md mx-auto mt-12 shadow-lg">
          <div className="text-5xl font-bold text-gray-900 mb-2">$299</div>
          <div className="text-gray-500 mb-6">per month</div>
          <ul className="text-left space-y-3 mb-8">
            {[
              "Unlimited lead qualification",
              "AI scoring & prioritization",
              "Auto-booking to your calendar",
              "Lead dashboard with full history",
              "Email + SMS alerts for hot leads",
              "7-day free trial, cancel anytime",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Loading..." : "Start 7-Day Free Trial"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center text-gray-400 text-sm">
        LeadQualifier by{" "}
        <a href="https://coremind.work" className="underline hover:text-gray-600">
          coremind.work
        </a>
        . Built for roofing contractors who want to stop chasing and start closing.
      </footer>
    </main>
  );
}
