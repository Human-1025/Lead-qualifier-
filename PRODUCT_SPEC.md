# LeadQualifier — Product Specification v1.0

## Competitive Landscape

| Category | Players | Trustpilot | What they do | What they DON'T do |
|----------|---------|-----------|-------------|-------------------|
| Lead Marketplaces | Angi, HomeAdvisor, Thumbtack | 2.5/5 avg | Sell leads to 3-5 contractors each | Qualify before selling |
| Roofing CRMs | JobNimbus, AccuLynx, Roofr | Varies | Manage jobs after lead becomes customer | Pre-qualify incoming leads |
| Booking Widgets | Housecall Pro, Calendly | Varies | Let customers book time | Ask qualification questions first |

**The gap:** A gatekeeper that sits between the lead source (contractor's website, Facebook, Google) and the CRM. Qualify first, route second. No one does this.

## Product Architecture

### The Lead Flow (end to end)

```
1. VISITOR lands on contractor's website
2. WIDGET loads (our JS snippet)
3. CHAT opens — AI asks 5 qualification questions
4. SCORE calculated (0-100) via DeepSeek
5. ROUTING:
   - Hot (90+): SMS alert + auto-book calendar + email
   - Warm (60-89): Email + dashboard notification
   - Cold (<60): Silently logged, never disturbs contractor
6. CONTRACTOR sees hot lead on phone, calls back immediately
7. LEAD tracked through pipeline: qualified → called → estimate → closed
```

### System Components

| Component | Purpose | Status |
|-----------|---------|--------|
| **Widget/Embed** | JS snippet on contractor's site that loads a chat qualification widget | NOT BUILT |
| **Auth System** | Contractor login after Stripe checkout | NOT BUILT |
| **Onboarding Wizard** | Post-signup setup: custom questions, embed code, preferences | NOT BUILT |
| **Lead API** | Receives widget submissions, runs qualification, stores in Supabase | EXISTS (partial) |
| **Dashboard** | Contractor view: lead list, scores, pipeline stats | EXISTS (basic) |
| **Notifications** | SMS + email when hot leads come in | NOT BUILT |
| **Stripe Checkout** | $299/mo subscription, 7-day trial | EXISTS (working) |

### Widget Design (The #1 Missing Piece)

The widget is a chat-style interface that loads on the contractor's website. Key requirements:

1. **One-line embed**: `<script src="https://lead-qualifier-core-mind.vercel.app/widget.js" data-contractor="ID"></script>`
2. **Floating button**: "Get a Free Estimate" or "Check If We Service Your Area" — triggers the chat
3. **Chat-style qualification**: Conversational AI asks 5 questions:
   - "What type of work do you need?" (Roof replacement, repair, inspection, etc.)
   - "Is this an insurance claim or paying out of pocket?"
   - "What's your timeline?" (Emergency/ASAP, this month, just exploring)
   - "What's your budget range?" (with options)
   - "What's the property address?"
4. **Score display**: After qualification, shows confidence score and "We'll get back to you within 15 minutes" (but contractor gets notified instantly)
5. **White-labeled**: Matches contractor's brand colors

### Onboarding Flow (Post-Checkout)

```
CHECKOUT COMPLETE → Redirect to setup wizard
  Step 1: Business name + phone + email confirmation
  Step 2: Configure qualification questions (pre-filled defaults, editable)
  Step 3: Embed code — copy/paste snippet, instructions for website
  Step 4: "Your widget is live. First lead typically arrives within 24 hours"
```

### Pricing Decision

Based on competitive research:
- **Keep $299/mo** as the main plan (unlimited leads, full features)
- **Add $99/mo starter** later: 100 leads/mo, email only
- Competitors charge $50-300 PER lead. We charge $99-299 for ALL leads.
- The value prop is immediately clear: "One Angi lead costs more than a month of LeadQualifier"

### Notification Rules

| Lead Score | Channel | Template |
|-----------|---------|----------|
| 90+ (Hot) | SMS + Email | "HOT LEAD: [Name], [Work Type], [Timeline]. Score: [X]. Call now: [Phone]" |
| 60-89 (Warm) | Email only | "New lead: [Name], [Work Type]. Score: [X]. Follow up within 24 hours." |
| <60 (Cold) | Dashboard only | Logged silently, visible in dashboard under "Cold" tab |

### Auth System

Supabase Auth with magic link:
1. Stripe checkout → create user in Supabase with email
2. Magic link sent to email
3. Click link → logged in → onboarding wizard
4. Session persisted via Supabase cookies

### Database Changes

Add to schema:
- `contractors` table: id, email, business_name, phone, stripe_customer_id, widget_config (JSON for branded settings), created_at
- Modify `leads` table: add source (widget/facebook/google/manual), raw_answers (JSON of Q&A), called_at, stage (qualified/called/estimate_ scheduled/closed_won/closed_lost)

---

## Build Plan

### Sprint 1: Widget + Auth + Onboarding (Makes it real)

1. Supabase Auth setup (email magic link)
2. Widget JS — chat qualification on contractor site
3. Post-checkout flow: create account → onboarding wizard → embed code
4. Widget configuration (contractor can set business name, brand color)

### Sprint 2: Notifications + Dashboard

1. Email notifications via Resend/SendGrid
2. SMS via Twilio for hot leads
3. Enhanced dashboard: pipeline stages, lead details view

### Sprint 3: Extras

1. Contractors can view full Q&A transcripts per lead
2. Lead status management (mark as called, estimate given, closed)
3. Basic analytics (leads/month, hot/warm/cold ratio)

