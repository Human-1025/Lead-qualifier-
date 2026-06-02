import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin not configured" },
        { status: 500 }
      );
    }

    // Create Supabase Auth user (email_confirm: true skips email verification)
    const { data: authUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
      });

    if (createError) {
      // If user already exists, fetch them instead
      if (createError.message?.includes("already") || createError.status === 422) {
        const { data: existingUsers } =
          await supabaseAdmin.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(
          (u) => u.email === email
        );
        if (!existing) {
          return NextResponse.json(
            { error: "Failed to find or create user" },
            { status: 500 }
          );
        }

        // Ensure contractor row exists
        const { data: existingContractor } = await supabaseAdmin
          .from("contractors")
          .select("id")
          .eq("id", existing.id)
          .single();

        if (!existingContractor) {
          await supabaseAdmin.from("contractors").insert({
            id: existing.id,
            email: email,
          });
        }

        return NextResponse.json({
          userId: existing.id,
          email: email,
          existed: true,
        });
      }

      console.error("Create user error:", createError);
      return NextResponse.json(
        { error: createError.message || "Failed to create user" },
        { status: 500 }
      );
    }

    // Create contractor row with id = auth user id
    await supabaseAdmin.from("contractors").insert({
      id: authUser.user.id,
      email: email,
    });

    return NextResponse.json({
      userId: authUser.user.id,
      email: email,
      existed: false,
    });
  } catch (error: any) {
    console.error("Register error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
