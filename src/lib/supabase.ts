import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client bypasses RLS — used for writes from server-side API routes
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

export async function saveLead(
  contractorId: string,
  lead: {
    name: string;
    phone: string;
    email: string;
    service_type: string;
    insurance_claim: boolean;
    timeline: string;
    property_address: string;
    budget_range: string;
    message: string;
    score: number;
    priority: string;
    summary: string;
    recommended_action: string;
  }
) {
  if (!supabaseAdmin) throw new Error("Supabase not configured");
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({
      contractor_id: contractorId,
      ...lead,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLeads(contractorId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("contractor_id", contractorId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getLeadStats(contractorId: string) {
  if (!supabase) return { hot: 0, warm: 0, cold: 0, total: 0 };
  const { data, error } = await supabase
    .from("leads")
    .select("priority, score")
    .eq("contractor_id", contractorId);

  if (error) return { hot: 0, warm: 0, cold: 0, total: 0 };

  const hot = data.filter((l) => l.priority === "hot").length;
  const warm = data.filter((l) => l.priority === "warm").length;
  const cold = data.filter((l) => l.priority === "cold").length;
  const total = data.length;

  return { hot, warm, cold, total };
}
