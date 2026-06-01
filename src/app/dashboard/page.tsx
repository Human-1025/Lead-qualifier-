"use client";

import { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Phone, Mail, MapPin, Clock, Shield, AlertTriangle } from "lucide-react";
import { BookNow } from "@/components/BookNow";

let supabaseClient: SupabaseClient | null = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service_type: string;
  insurance_claim: boolean;
  timeline: string;
  property_address: string;
  score: number;
  priority: "hot" | "warm" | "cold";
  summary: string;
  recommended_action: string;
  created_at: string;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({ hot: 0, warm: 0, cold: 0, total: 0 });
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cold">("all");

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) {
      setLeads(data);
      setStats({
        hot: data.filter((l) => l.priority === "hot").length,
        warm: data.filter((l) => l.priority === "warm").length,
        cold: data.filter((l) => l.priority === "cold").length,
        total: data.length,
      });
    }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.priority === filter);

  const priorityColor = (p: string) =>
    p === "hot" ? "bg-red-100 text-red-800" : p === "warm" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600";

  const priorityIcon = (p: string) =>
    p === "hot" ? "🔥" : p === "warm" ? "⏳" : "❄️";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LeadQualifier</h1>
            <p className="text-gray-500 text-sm">Your AI-powered lead pipeline</p>
          </div>
          <div className="flex items-center gap-4">
            <BookNow />
            <a
              href="/api/leads/embed"
              target="_blank"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Get Embed Code →
            </a>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Hot Leads", value: stats.hot, color: "text-red-600", bg: "bg-red-50" },
            { label: "Warm Leads", value: stats.warm, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Cold Leads", value: stats.cold, color: "text-gray-500", bg: "bg-gray-50" },
            { label: "Total Leads", value: stats.total, color: "text-orange-600", bg: "bg-orange-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-6`}>
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-gray-600 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "hot", "warm", "cold"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f === "all" ? "All" : `${priorityIcon(f)} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No leads yet</p>
              <p className="text-sm mt-1">
                Leads from your website form will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Lead
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Timeline
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Score
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {lead.phone && (
                            <span className="inline-flex items-center gap-1 mr-3">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </span>
                          )}
                          {lead.email && (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </span>
                          )}
                        </div>
                        {lead.property_address && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {lead.property_address}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm text-gray-700">
                          {lead.service_type.replace(/_/g, " ")}
                        </span>
                        {lead.insurance_claim && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <Shield className="w-3 h-3" /> Insurance
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span className="capitalize">{lead.timeline.replace(/_/g, " ")}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${priorityColor(lead.priority)}`}
                          >
                            {priorityIcon(lead.priority)} {lead.score}/100
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-orange-600 capitalize">
                          {lead.recommended_action.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
