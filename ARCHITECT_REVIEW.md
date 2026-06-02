================================================================================
ARCHITECT REVIEW — LeadQualifier: signup → first lead loop
================================================================================

DATE: 2026-06-02
REVIEWER: Architect subagent
CODEBASE: /Users/islambadr/Desktop/coremind/products/lead-qualifier

================================================================================
0.  THE INTENDED FLOW (what should happen)
================================================================================

  User lands → "Start Free Trial" → Stripe checkout
       ↓
  Stripe webhook fires → creates contractor row in Supabase
       ↓
  User logs in via magic link → sent to /onboarding
       ↓
  Onboarding saves business info + questions to contractors table
       ↓
  User gets embed code with real contractor UUID
       ↓
  User pastes <script> on their roofing website
       ↓
  Visitor fills widget → POST /api/leads with contractor_id
       ↓
  API qualifies lead via AI, saves to Supabase
       ↓
  Contractor logs into /dashboard → sees their leads (filtered by contractor_id)

================================================================================
1.  CRITICAL BUGS — BLOCKING THE LOOP (ranked by impact)
================================================================================

BUG #1 [BLOCKER] leads API throws away the real contractor_id
  File: src/app/api/leads/route.ts, line 22
  Problem:
    const uuid = crypto.randomUUID();       // <-- random UUID
    await saveLead(uuid, { ... });          // <-- passed as contractor_id
    The API correctly extracts `contractorId` from the body, validates it
    (line 9), then IGNORES it and generates a fresh random UUID. Every lead
    goes to a random non-existent contractor.
  Root cause: copy-paste error — likely a placeholder that was never replaced.

BUG #2 [BLOCKER] Widget → API field name mismatch (snake_case vs camelCase)
  File: public/widget.js (sends snake_case) vs src/app/api/leads/route.ts
  Widget payload:
    contractor_id, service_type, insurance_claim, timeline,
    budget_range, property_address, message
  API destructuring:
    const { contractorId, ...leadData } = body;
    // contractorId = undefined (JavaScript is case-sensitive!)
  API mapping:
    service_type: leadData.serviceType      // undefined
    insurance_claim: leadData.insuranceClaim // undefined
    timeline: leadData.timeline             // undefined
    property_address: leadData.propertyAddress  // undefined
    budget_range: leadData.budgetRange      // undefined
  RESULT: Even if Bug #1 were fixed, contractorId would be undefined,
  triggering the 400 error. And all lead fields would be undefined/empty.

BUG #3 [BLOCKER] No Stripe webhook endpoint
  File: MISSING — no src/app/api/stripe/webhook/route.ts
  Problem: Stripe checkout succeeds but nothing happens. No contractor
  record is created. The user pays $299 and the system has no idea who
  they are.
  What exists: src/app/api/stripe/route.ts only creates a checkout session
  and returns the Stripe URL. It does NOT:
    - Create a user
    - Pass client_reference_id to Stripe
    - Have any webhook listener
  The flow dead-ends at Stripe.

BUG #4 [BLOCKER] Onboarding uses hardcoded demo ID, never saves to DB
  File: src/app/onboarding/page.tsx, line 31
    const contractorId = "demo-contractor";
  Problem: The embed code shown to the user has data-owner="demo-contractor".
  Even if bugs #1-3 were fixed, all widget submissions would go to "demo".
  handleSave() is a no-op:
    await new Promise((r) => setTimeout(r, 800)); // 800ms timeout, nothing else

BUG #5 [BLOCKER] Dashboard queries ALL leads with no contractor_id filter
  File: src/app/dashboard/page.tsx, line 47
    .from("leads").select("*").order("created_at", { ascending: false })
  Problem: No .eq("contractor_id", userId). If RLS is correctly configured,
  the anon client would filter by auth.uid(). But since leads have random
  contractor_id values (Bug #1), no leads ever appear anyway.
  Defense: This is partially protected by Supabase RLS, BUT if the service
  role key leaks into the client (which it shouldn't), all leads exposed.

BUG #6 [MEDIUM] Widget success handler reads wrong JSON path
  File: public/widget.js, line ~145
    var score = data.score || 75;
  Problem: API returns { success: true, lead: qualified }.
  Score is at data.lead.score, not data.score. Always shows default 75.

BUG #7 [MEDIUM] Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.example
  File: .env.local.example
  Problem: saveLead() uses supabaseAdmin which requires
  SUPABASE_SERVICE_ROLE_KEY, but this env var is undocumented.

BUG #8 [LOW] Widget hardcodes production URL
  File: public/widget.js, line ~138
    fetch("https://lead-qualifier-core-mind.vercel.app/api/leads", ...)
  Problem: Won't work on localhost, staging, or preview deployments.
  Fix: use relative path (e.g., "/api/leads") or detect origin from script src.

BUG #9 [LOW] No CORS headers on leads API
  File: src/app/api/leads/route.ts
  Problem: Widget embeds on any contractor domain. Browser blocks cross-origin
  POST if CORS headers aren't set.

================================================================================
2.  ADDITIONAL BUGS DISCOVERED DURING REVIEW
================================================================================

BUG #10 [SECURITY] leads API has no contractor_id existence validation
  Even when the ID is passed correctly, the API doesn't check if the
  contractor_id actually exists in the contractors table. Malicious actors
  could submit leads to non-existent UUIDs.

BUG #11 [SECURITY] No rate limiting on /api/leads
  Public endpoint, no rate limit. Could be spammed to exhaust AI API quota.

BUG #12 [SECURITY] Stripe price ID not validated
  File: src/app/api/stripe/route.ts — accepts any priceId from the client.
  A user could pass a $0 or fake price ID.

BUG #13 [ARCH] Identity model confusion: contractors.id ≠ auth.users.id
  Schema: contractors(id UUID) — auto-generated, NOT linked to auth.users.
  RLS: contractor_id = auth.uid() — assumes contractor_id IS the auth user UUID.
  These two IDs will never match unless explicitly set equal.

BUG #14 [ARCH] qualifyLead returns interface that doesn't match saveLead input
  File: src/lib/qualify.ts → QualifiedLead interface vs saveLead parameter types.
  saveLead expects snake_case DB column names. qualifyLead returns camelCase
  (serviceType, insuranceClaim, etc. from the LeadData interface). The API
  route manually remaps, but only for 4 out of 6 qualification fields
  (missing qualifyingFactors, disqualifyingFactors).

================================================================================
3.  MINIMAL FIXES TO CLOSE THE LOOP (in order of execution)
================================================================================

FIX 1: Create Stripe webhook endpoint
  FILE: src/app/api/stripe/webhook/route.ts (NEW FILE)
  WHAT: Handle checkout.session.completed event. Extract customer email from
  Stripe session. Create Supabase Auth user via Admin API (or link to existing
  user by email). Insert row into `contractors` table with auth user UUID as id.
  ALTERNATIVE (simpler for MVP): 
    Flip the flow. User signs up FIRST (magic link) → auth user created →
    onboarding saves contractor row → Stripe checkout later as upgrade step.
    Then webhook just updates stripe fields on existing contractor.

FIX 2: Fix leads API — use real contractor_id, fix field names
  FILE: src/app/api/leads/route.ts
  CHANGES:
    // Accept both snake_case and camelCase from widget
    const contractorId = body.contractor_id || body.contractorId;
    if (!contractorId) { return 400; }
    
    // Validate contractor exists (security)
    const { data: contractor } = await supabaseAdmin
      .from("contractors").select("id").eq("id", contractorId).single();
    if (!contractor) { return 400, "Invalid contractor"; }
    
    // Map widget fields properly (widget sends snake_case, DB uses snake_case)
    await saveLead(contractorId, {
      name: leadData.name || body.name,
      phone: leadData.phone || body.phone || "",
      email: leadData.email || body.email || "",
      service_type: leadData.service_type || body.service_type || "",
      insurance_claim: leadData.insurance_claim ?? body.insurance_claim ?? false,
      timeline: leadData.timeline || body.timeline || "",
      property_address: leadData.property_address || body.property_address || "",
      budget_range: leadData.budget_range || body.budget_range || "",
      message: leadData.message || body.message || "",
      ...
    });

FIX 3: Fix onboarding — use real auth user UUID, save to DB
  FILE: src/app/onboarding/page.tsx
  CHANGES:
    useEffect(() => {
      supabase?.auth.getUser().then(({ data }) => {
        if (data.user) setContractorId(data.user.id);
      });
    }, []);
    
    const handleSave = async () => {
      setSaving(true);
      await supabaseAdmin?.from("contractors").upsert({
        id: contractorId,  // = auth.uid()
        business_name: businessName,
        phone: phone,
        questions: questions,
      });
      setSaving(false);
      router.push("/dashboard");
    };

FIX 4: Fix dashboard — filter by contractor_id
  FILE: src/app/dashboard/page.tsx
  CHANGES:
    // Get user ID from session
    const { data: { user } } = await supabase.auth.getUser();
    const contractorId = user?.id;
    
    // Filter leads
    .from("leads").select("*")
    .eq("contractor_id", contractorId)
    .order("created_at", { ascending: false });

FIX 5: Fix widget — use correct JSON path for score
  FILE: public/widget.js, line ~145
  CHANGE:
    var score = (data.lead && data.lead.score) || 75;

FIX 6: Add CORS headers to leads API
  FILE: src/app/api/leads/route.ts
  ADD:
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }

FIX 7: Add SUPABASE_SERVICE_ROLE_KEY to env example
  FILE: .env.local.example
  ADD:
    # Supabase service role key (server-side only, bypasses RLS)
    SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

================================================================================
4.  ARCHITECTURAL DECISIONS THAT NEED REDESIGN
================================================================================

ISSUE A: Signup flow is backwards
  Current: Stripe checkout → magic link → onboarding
  Problem: Stripe doesn't create a user, so there's nothing to link the
  payment to. No user identity exists at checkout time.
  
  RIGHT PATTERN for SaaS with magic link:
    a) User enters email → magic link → auth user created
    b) Redirect to /onboarding → saves contractor record (id = auth.uid())
    c) During or after onboarding → "Start free trial" → Stripe checkout
       Pass auth.uid() as client_reference_id
    d) Webhook receives client_reference_id → updates contractor.stripe_* fields
    e) Middleware checks subscription_status on protected routes
  
  OR (if Stripe-first is mandatory):
    a) Collect email on landing page → create checkout session with customer_email
    b) Webhook fires → create Supabase Auth user via admin API →
       auto-send magic link → user clicks → logged in
    c) Pro: one less step for user. Con: more webhook complexity.

ISSUE B: contractors.id vs auth.users.id identity model
  Both need to be the SAME UUID for RLS to work. The RLS policy says:
    contractor_id = auth.uid()
  This means the contractor_id in leads MUST equal the Supabase Auth user UUID.
  If contractors table uses auto-generated gen_random_uuid(), they'll never match.
  
  FIX: When creating contractor row, explicitly set id = auth_user.id.
  Or: Add a `user_id` column to contractors that references auth.users.id,
  and use that for RLS instead of contractor_id.

ISSUE C: RLS design is correct but nobody uses it
  The RLS policy is well-written:
    CREATE POLICY "contractor_leads" ON leads
      FOR ALL USING (contractor_id = auth.uid());
  But:
    - API uses supabaseAdmin (service role) → RLS bypassed (good for server
      writes, but no validation of contractor_id existence)
    - Dashboard uses anon client → should filter via RLS but is missing the
      .eq() clause anyway (though RLS would apply)
    - Widget submissions go through API (service role) → no auth context

  RECOMMENDATION: Keep service role for server writes (necessary for widget
  submissions from unauthenticated visitors), but always validate
  contractor_id exists manually.

ISSUE D: Widget architecture is too tightly coupled
  - Hardcoded production URL
  - Fixed questions in JS (not fetched from contractor config)
  - No versioning (cache-busting will be a nightmare)
  - No error recovery or retry
  - Could be simpler as an iframe for isolation

================================================================================
5.  SIMPLEST DATABASE SCHEMA TO SUPPORT THIS FLOW
================================================================================

The existing schema is already nearly correct. Minimal changes:

ALTER TABLE contractors 
  ADD COLUMN business_name TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN questions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN user_id UUID REFERENCES auth.users(id);  -- link to auth

-- If using contractors.id = auth.uid(), then:
-- When creating contractor: INSERT INTO contractors (id, email, ...) 
-- VALUES (auth.user_id, ...)

-- The leads table is fine as-is. contractor_id FK to contractors.id.

The key constraint: contractor_id in leads = contractor.id = auth.users.id.
Three-way equality for RLS to work.

================================================================================
6.  SECURITY CONCERNS (summary)
================================================================================

HIGH:
  - /api/leads is public with no contractor_id validation — anyone can
    submit to any UUID, potentially exhausting AI quotas
  - No rate limiting on public API
  - Stripe priceId not server-validated

MEDIUM:
  - Dashboard: if service role key leaks client-side, all leads exposed
  - No CSRF protection on widget submission
  - Widget can be embedded on any domain — no origin validation

LOW:
  - API keys in .env.local could leak via client bundle if imported
    incorrectly (safe currently; only server-side imports touch secrets)

================================================================================
7.  RIGHT STRIPE WEBHOOK PATTERN FOR NEXT.JS ON VERCEL
================================================================================

1. Webhook route: src/app/api/stripe/webhook/route.ts
   - Use raw body (req.text()) — NEVER req.json() for webhooks
   - Verify signature: stripe.webhooks.constructEvent(body, sig, secret)
   - Respond 200 quickly, process async if needed
   - Idempotency: check if event already processed (store event IDs)

2. Env vars needed:
   - STRIPE_SECRET_KEY (already exists)
   - STRIPE_WEBHOOK_SECRET (whsec_... — from Stripe dashboard)

3. Stripe dashboard setup:
   - Webhook URL: https://lead-qualifier-core-mind.vercel.app/api/stripe/webhook
   - Events: checkout.session.completed, customer.subscription.updated,
     customer.subscription.deleted
   
4. Checkout session must carry user identity:
   Option A (pre-auth): Use customer_email + metadata.client_reference_id
     POST /api/stripe { email: "user@..." }
     → Create checkout with customer_email
     → Webhook gets session.customer_details.email
     → Find or create user by email
   
   Option B (post-auth): User is already logged in
     POST /api/stripe (authenticated)
     → Use auth.uid() as client_reference_id
     → Webhook reads session.client_reference_id
     → Update contractor by id

5. Vercel-specific: 
   - No long-running connections. Respond to webhook in <10s.
   - Use Supabase Edge Functions or QStash for background processing
     if webhook handling might exceed Vercel's 10s function timeout.

================================================================================
8.  SUMMARY: WHAT TO DO TODAY TO CLOSE THE LOOP
================================================================================

Priority order (everything below is ~4 hours of work):

1. [30 min] Fix Bug #1 + #2 in leads API (use real contractor_id, fix field names)
2. [30 min] Fix Bug #4 in onboarding (use auth user UUID, save to DB)
3. [30 min] Fix Bug #5 in dashboard (filter by contractor_id)
4. [30 min] Fix Bug #3: Create Stripe webhook endpoint
5. [15 min] Fix Bug #6 in widget (correct score path)
6. [15 min] Fix Bug #8 in widget (use relative URL)
7. [15 min] Add CORS headers (Bug #9)
8. [15 min] Add missing env var to .env.local.example (Bug #7)
9. [30 min] Add rate limiting + contractor_id validation to leads API
10. [15 min] Validate priceId on server side in stripe route

After these 10 fixes, the loop closes end-to-end.

================================================================================
