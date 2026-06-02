import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!supabaseAdmin) return NextResponse.json({ leads: [], stats: { hot: 0, warm: 0, cold: 0, total: 0 } });

  const { data: leads } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("contractor_id", user.id)
    .order("created_at", { ascending: false });

  const leadsArr = leads || [];
  return NextResponse.json({
    leads: leadsArr,
    stats: {
      hot: leadsArr.filter((l) => l.priority === "hot").length,
      warm: leadsArr.filter((l) => l.priority === "warm").length,
      cold: leadsArr.filter((l) => l.priority === "cold").length,
      total: leadsArr.length,
    },
  });
}
