import { NextRequest, NextResponse } from "next/server";

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

      if (customerEmail) {
        // Use Supabase Admin to create/update contractor
        const { supabaseAdmin } = await import("@/lib/supabase");

        if (supabaseAdmin) {
          // Upsert contractor by email
          const { data: existing } = await supabaseAdmin
            .from("contractors")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (!existing) {
            await supabaseAdmin.from("contractors").insert({
              email: customerEmail,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: "active",
            });
            console.log(`Contractor created: ${customerEmail}`);
          } else {
            await supabaseAdmin
              .from("contractors")
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_status: "active",
              })
              .eq("id", existing.id);
            console.log(`Contractor updated: ${customerEmail}`);
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
