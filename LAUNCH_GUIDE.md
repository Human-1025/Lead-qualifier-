# LeadQualifier — Launch Guide

Complete walkthrough to go from zero to live in ~30 minutes.

---

## Table of Contents

1. [Supabase Setup](#1-supabase-setup)
2. [Stripe Setup](#2-stripe-setup)
3. [DeepSeek API Key (Optional)](#3-deepseek-api-key-optional)
4. [Groq API Key (Optional, Free)](#4-groq-api-key-optional-free)
5. [Cal.com Booking Link](#5-calcom-booking-link)
6. [GitHub + Vercel Deploy](#6-github--vercel-deploy)
7. [Final Checklist](#7-final-checklist)

---

## 1. Supabase Setup

**What it is:** Your database. Stores leads, contractor accounts, scoring data.

### Step by step:

1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign in"** (use GitHub login)
3. Click **"New project"**
4. Fill in:
   - **Name:** `lead-qualifier`
   - **Database Password:** generate one (save it in your password manager)
   - **Region:** East US (closest to your US customers)
   - **Pricing Plan:** Free tier ($0/month — 500MB database, 2 projects)
5. Click **"Create new project"** — wait 2 minutes for provisioning

6. Once created, go to **Settings → API** (left sidebar)
7. Copy these two values:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_...` — this is the modern key format). sb_publishable_R33bvON-iLfTY18xz1z_3Q_OVHQ0SPn
   - Note: The legacy `anon` key (starts with `eyJ...`) also works if you prefer it — it's in the "Legacy" tab of the same page https://dncsyidgjpkemqvffghw.supabase.co/rest/v1/

8. In your project directory, create `.env.local`:
```bash
cd ~/Desktop/coremind/products/lead-qualifier
cp .env.local.example .env.local
```

9. Edit `.env.local` and paste:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_... (or eyJ... legacy)
```

10. Run the database schema:
   - Go to **SQL Editor** (left sidebar in Supabase dashboard)
   - Click **"New query"**
   - Open `supabase-schema.sql` on your machine and copy its entire contents
   - Paste into the SQL editor
   - Click **"Run"**

**✅ Supabase done.** You now have a `leads` table and a `contractors` table with Row-Level Security.

---

## 2. Stripe Setup

**What it is:** Handles payments. $299/mo subscription billing.

### Step by step:

1. Go to https://dashboard.stripe.com/register
2. Sign up (you don't need a company — use your name as sole proprietor)
3. **Skip** the "activate payments" step for now — you can do test mode

4. In the Stripe dashboard, make sure **"Test mode"** is ON (toggle in top-right corner)
   - Test mode lets you test payments without real money
   - Switch to live mode when you're ready for real customers

5. Go to **"Product catalog"** → **"Add product"**
   - **Name:** `LeadQualifier — Monthly`
   - **Description:** `AI lead qualification for roofing contractors. Unlimited leads, 24/7 qualification, auto-booking.`
   - **Price:** `$299.00 USD`
   - **Recurring:** Monthly
   - Click **"Save product"**

6. After saving, you'll see a **Price ID**. It looks like `price_1XXXXXX...` price_1TdaqsEoqpjozZHs7RsrgxlH
   - Copy this ID  prod_UcqXjX4P3oF16B

7. Go to **Developers → API keys** (left sidebar)
   - Copy the **Secret key** (starts with `sk_test_...`) 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
   - Also copy the **Publishable key** (starts with `pk_test_...`) pk_live_51RwLV7EoqpjozZHsgkCJt0Eea1nZlBU3zNQT0QYLTRVJssRwth0NX20rdmwiA5D7T3VR5UAzw9unmuq54Vgr8WKR00UubfG4lO

8. Add to `.env.local`:
```
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1XXXXXX...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**✅ Stripe done.** Test mode is active. You can run test payments with card number `4242 4242 4242 4242`.

---

## 3. DeepSeek API Key (Optional)

**What it is:** Powers the AI lead qualification. $0.14/million tokens — ~$0.0007 per lead qualified (basically free at any realistic volume).

If you skip this, the fallback rule-based scoring still works fine.

### Step by step:

1. Go to https://platform.deepseek.com
2. Click **"Sign up"** (use email or Google)
3. Go to **API Keys** in the dashboard
4. Click **"Create new API key"**
5. Name it `lead-qualifier`
6. Copy the key immediately (it only shows once)

7. Add to `.env.local`:
```
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
```

**✅ DeepSeek done.** The qualification engine will use this first.

---

## 4. Groq API Key (Optional, Free)

**What it is:** Backup AI provider. Free tier is very generous — fast inference with Llama 3.1. Use this if DeepSeek is down or if you don't have a DeepSeek key.

### Step by step:

1. Go to https://console.groq.com
2. Click **"Sign in"** (use Google or GitHub)
3. Go to **API Keys** in the left sidebar
4. Click **"Create API Key"**
5. Name it `lead-qualifier`
6. Copy the key

7. Add to `.env.local`:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

**✅ Groq done.** Free fallback AI. Costs you literally nothing.

---

## 5. Cal.com Booking Link

**What it is:** When a lead is qualified, the contractor clicks "Book Estimate Now" and lands on a Cal.com booking page. They schedule directly.

### Option A: Use the built-in link (easiest)

The product already has a default Cal.com link: `https://cal.com/coremind/roofing-consult`

This works immediately — no setup needed. Just leave it as-is for launch.

### Option B: Create your own Cal.com

1. Go to https://cal.com
2. Sign up (free tier — unlimited bookings)
3. Create an event type like "Roofing Estimate — 30 min"
4. Copy your booking link (looks like `https://cal.com/your-username/roofing-estimate`)
5. Update `src/components/BookNow.tsx` with your link (or pass it as a prop)

**✅ Cal.com done.** Free tier handles all your booking needs.

---

## 6. GitHub + Vercel Deploy

### Create GitHub repo:

```bash
cd ~/Desktop/coremind/products/lead-qualifier

# Initialize git
git init
git add .
git commit -m "LeadQualifier v1 — AI lead qualification for roofing contractors"

# Create repo on GitHub (browser: github.com/new — name it "lead-qualifier")
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/lead-qualifier.git
git branch -M main
git push -u origin main
```

### Deploy to Vercel:

1. Go to https://vercel.com
2. Click **"Sign up"** (use GitHub login)
3. Click **"New Project"**
4. Select the `lead-qualifier` repo
5. Vercel auto-detects Next.js — no config needed

6. **Add Environment Variables** (this is critical):
   - Click **"Environment Variables"**
   - Add EVERY variable from your `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL          = https://...supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY     = sb_publishable_... (or eyJ... legacy)
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_... (or pk_live_...)
     NEXT_PUBLIC_STRIPE_PRICE_ID       = price_...
     STRIPE_SECRET_KEY=***     DEEPSEEK_API_KEY=***  (if you set it)
     GROQ_API_KEY=*** (if you set it)
     ```
     ```

7. Click **"Deploy"**

8. Wait 60 seconds. Done.

**✅ Deploy done.** Your product is live at `https://lead-qualifier.vercel.app`.

### Optional: Custom domain

1. In Vercel dashboard → **Settings → Domains**
2. Add `lead-qualifier.coremind.work`
3. In Cloudflare (or wherever coremind.work is managed):
   - Add a CNAME record: `lead-qualifier` → `cname.vercel-dns.com`
4. Vercel auto-provisions SSL

---

## 7. Final Checklist

```
[ ] Supabase project created, schema run, URL + anon key in .env.local
[ ] Stripe account created, $299 product created, keys in .env.local
[ ] DeepSeek API key in .env.local (or skip — fallback works)
[ ] Groq API key in .env.local (or skip — fallback works)
[ ] Cal.com link verified (default works fine)
[ ] GitHub repo created and pushed
[ ] Vercel deployed with all env vars
[ ] Open your site, click "Start Free Trial" — Stripe test checkout works
[ ] Deploy to custom domain (optional)
```

### Test your deployment:

1. Go to your Vercel URL
2. Click **"Start 7-Day Free Trial"**
3. Use test card: `4242 4242 4242 4242` / any future date / any CVC
4. After checkout, you should land on `/dashboard`
5. Dashboard shows "No leads yet" — that's correct, no leads submitted yet

### Test a lead submission:

```bash
curl -X POST https://your-app.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "contractorId": "test",
    "name": "John Smith",
    "phone": "555-0123",
    "email": "john@example.com",
    "serviceType": "roof_replacement",
    "insuranceClaim": true,
    "timeline": "emergency",
    "propertyAddress": "123 Main St, Austin TX 78701",
    "budgetRange": "15000",
    "message": "Tree fell on our roof last night. Water coming in. Insurance adjuster coming tomorrow. Need estimate ASAP."
  }'
```

You should get back a JSON response with `score: 92+` and `priority: "hot"`.

---

**Total time: ~30 minutes. Total cost: $0/month until you get a paying customer.**
