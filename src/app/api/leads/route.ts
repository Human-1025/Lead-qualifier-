import { NextRequest, NextResponse } from "next/server";
import { qualifyLead } from "@/lib/qualify";
import { saveLead } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractorId, ...leadData } = body;

    if (!contractorId) {
      return NextResponse.json(
        { error: "Missing contractorId" },
        { status: 400 }
      );
    }

    // Run AI qualification
    const qualified = await qualifyLead(leadData);

    // Generate proper UUID for contractor_id
    const uuid = crypto.randomUUID();

    // Save to database
    await saveLead(uuid, {
      name: leadData.name,
      phone: leadData.phone || "",
      email: leadData.email || "",
      service_type: leadData.serviceType,
      insurance_claim: leadData.insuranceClaim,
      timeline: leadData.timeline,
      property_address: leadData.propertyAddress,
      budget_range: leadData.budgetRange,
      message: leadData.message || "",
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
