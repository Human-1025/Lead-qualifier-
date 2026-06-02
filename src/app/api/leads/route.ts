import { NextRequest, NextResponse } from "next/server";
import { qualifyLead } from "@/lib/qualify";
import { saveLead } from "@/lib/supabase";

function normalizeTimeline(raw: string): "emergency" | "weeks" | "months" | "just_browsing" {
  const t = (raw || "").toLowerCase();
  if (t.includes("emergency") || t.includes("asap")) return "emergency";
  if (t.includes("month") && (t.includes("this") || t.includes("next"))) return "weeks";
  if (t.includes("explor") || t.includes("brows")) return "just_browsing";
  return "months";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contractorId = body.contractor_id;

    if (!contractorId) {
      return NextResponse.json({ error: "Missing contractor_id" }, { status: 400 });
    }

    // Map snake_case widget payload → camelCase for qualification engine
    const leadData = {
      name: body.name || "Website Visitor",
      phone: body.phone || "",
      email: body.email || "",
      serviceType: body.service_type || "Other",
      insuranceClaim: !!body.insurance_claim,
      timeline: normalizeTimeline(body.timeline || ""),
      propertyAddress: body.property_address || "",
      budgetRange: body.budget_range || "",
      message: body.message || "",
    };

    // Qualify
    const qualified = await qualifyLead(leadData);

    // Save with the REAL contractor_id from the widget
    await saveLead(contractorId, {
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      service_type: leadData.serviceType,
      insurance_claim: leadData.insuranceClaim,
      timeline: leadData.timeline,
      property_address: leadData.propertyAddress,
      budget_range: leadData.budgetRange,
      message: leadData.message,
      score: qualified.score,
      priority: qualified.priority,
      summary: qualified.summary,
      recommended_action: qualified.recommendedAction,
    });

    return NextResponse.json({ success: true, lead: qualified });
  } catch (error: any) {
    console.error("Lead submission error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to process lead" },
      { status: 500 }
    );
  }
}
