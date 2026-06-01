-- Supabase Migration: LeadQualifier Schema
-- Run this in Supabase SQL Editor

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service_type TEXT NOT NULL,
  insurance_claim BOOLEAN DEFAULT false,
  timeline TEXT NOT NULL,
  property_address TEXT,
  budget_range TEXT,
  message TEXT,
  score INTEGER NOT NULL DEFAULT 50,
  priority TEXT NOT NULL DEFAULT 'warm',
  summary TEXT,
  recommended_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by contractor
CREATE INDEX IF NOT EXISTS idx_leads_contractor ON leads (contractor_id, created_at DESC);
-- Index for priority filtering
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads (contractor_id, priority);

-- Contractors table (paid users)
CREATE TABLE IF NOT EXISTS contractors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trialing',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: contractors can only see their own leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contractor_leads" ON leads
  FOR ALL USING (contractor_id = auth.uid());

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contractor_self" ON contractors
  FOR SELECT USING (id = auth.uid());
