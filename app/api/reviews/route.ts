import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

import type { Database } from "@/lib/supabase/types"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/shared"

const reviewCreateSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(30).optional(),
  role: z.enum(["Student", "Parent"]),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(5, "Message should be at least 5 characters.").max(3000),
})

function createPublicSupabaseClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from("reviews")
      .select("id, full_name, role, message, rating, created_at")
      .order("created_at", { ascending: false })
      .limit(80)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reviews: data ?? [] }, { status: 200 })
  } catch (error) {
    console.error("GET /api/reviews failed:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = reviewCreateSchema.safeParse(body)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return NextResponse.json(
        {
          error: firstIssue?.message || "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      )
    }

    const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.replace(/\s+/g, " ").trim()

    const supabase = createPublicSupabaseClient()
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        full_name: fullName,
        role: parsed.data.role,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        message: parsed.data.message,
        rating: parsed.data.rating,
      })
      .select("id, full_name, role, message, rating, created_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ review: data }, { status: 201 })
  } catch (error) {
    console.error("POST /api/reviews failed:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
