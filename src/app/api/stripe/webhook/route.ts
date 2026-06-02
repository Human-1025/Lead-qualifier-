import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  // In production, verify Stripe signature with webhook secret
  // For now: handle the checkout.session.completed event
  try {
    const event = await req.json();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const clientReferenceId = session.client_reference_id as string | undefined;

      if (customerEmail && supabaseAdmin) {
        // Use client_reference_id as the contractor ID (it's the Supabase Auth user ID)
        const contractorId = clientReferenceId;

        if (contractorId) {
          // Update the contractor row created during registration
          const { error: updateError } = await supabaseAdmin
            .from("contractors")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: "active",
            })
            .eq("id", contractorId);

          if (updateError) {
            console.error("Contractor update error:", updateError);
          } else {
            console.log(`Contractor ${contractorId} subscription active`);
          }
        } else {
          // Fallback: no client_reference_id — match by email (legacy)
          const { data: existing } = await supabaseAdmin
            .from("contractors")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (existing) {
            await supabaseAdmin
              .from("contractors")
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_status: "active",
              })
              .eq("id", existing.id);
          } else {
            await supabaseAdmin.from("contractors").insert({
              email: customerEmail,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: "active",
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
