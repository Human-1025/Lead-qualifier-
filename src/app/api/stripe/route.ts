import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: null as any,
    timeout: 30000,
    maxNetworkRetries: 3,
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { priceId, successUrl, cancelUrl } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        product: "lead-qualifier",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
