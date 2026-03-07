const { createClient } = require("@supabase/supabase-js")

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing env var: ${name}`)
  }
  return value
}

const seedReviews = [
  {
    full_name: "Aarav Sharma",
    role: "Student",
    message: "The classes made me confident and consistent. Every week I could feel the progress in my playing.",
    rating: 5,
  },
  {
    full_name: "Priya Patel",
    role: "Parent",
    message: "My daughter enjoys every session. The lessons are structured, patient, and highly encouraging.",
    rating: 5,
  },
  {
    full_name: "Rohan Singh",
    role: "Student",
    message: "From stage fear to stage confidence, AMacademy helped me develop both skill and mindset.",
    rating: 5,
  },
  {
    full_name: "Sneha Gupta",
    role: "Student",
    message: "Practice feels purposeful now. I understand not just what to play, but why it sounds good.",
    rating: 5,
  },
  {
    full_name: "Rajesh Kumar",
    role: "Parent",
    message: "One of the best decisions for my son. The teaching style balances discipline and creativity.",
    rating: 5,
  },
  {
    full_name: "Anjali Desai",
    role: "Student",
    message: "Friendly, focused, and motivating. I improved in technique and expression much faster than expected.",
    rating: 5,
  },
  {
    full_name: "Vikram Singh",
    role: "Parent",
    message: "The academy truly cares about individual growth. My child is excited to attend every class.",
    rating: 5,
  },
  {
    full_name: "Meera Nair",
    role: "Student",
    message: "The feedback is specific and practical. My rhythm and hand control improved significantly.",
    rating: 5,
  },
]

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: existingRows, error: existingError } = await supabase
    .from("reviews")
    .select("full_name,message")
    .limit(1000)

  if (existingError) {
    throw new Error(`Failed to fetch existing reviews: ${existingError.message}`)
  }

  const existingSet = new Set((existingRows || []).map((r) => `${r.full_name}::${r.message}`))
  const toInsert = seedReviews
    .filter((r) => !existingSet.has(`${r.full_name}::${r.message}`))
    .map((r) => ({
      ...r,
      email: "seed@amacademymusic.com",
      phone: null,
    }))

  if (toInsert.length === 0) {
    console.log("No new mock reviews to insert. Database already has all seeded entries.")
    return
  }

  const { error: insertError } = await supabase.from("reviews").insert(toInsert)
  if (insertError) {
    throw new Error(`Failed to insert reviews: ${insertError.message}`)
  }

  console.log(`Inserted ${toInsert.length} review(s) into Supabase.`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})

