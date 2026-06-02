import { NextRequest, NextResponse } from "next/server";

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured");
  return key;
}

export async function POST(req: NextRequest) {
  try {
    const key = getStripeKey();
    const { priceId, successUrl, cancelUrl } = await req.json();

    const body = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "success_url": successUrl,
      "cancel_url": cancelUrl,
      "metadata[product]": "lead-qualifier",
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Stripe API error" },
        { status: response.status }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error("Stripe error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
