"use client"

import { useEffect, useMemo, useState } from "react"
import { Star } from "lucide-react"

interface Review {
  id?: string
  name: string
  role: string
  message: string
  rating: number
}

interface ApiReview {
  id: string
  full_name: string
  role: string
  message: string
  rating: number
}

const COLUMN_COUNT = 4
const TRACK_REPEAT_COUNT = 3

function rotateReviews(reviews: Review[], offset: number) {
  if (reviews.length === 0) return []
  const normalizedOffset = ((offset % reviews.length) + reviews.length) % reviews.length
  return [...reviews.slice(normalizedOffset), ...reviews.slice(0, normalizedOffset)]
}

function buildColumnTracks(reviews: Review[], columnCount: number) {
  if (reviews.length === 0) return Array.from({ length: columnCount }, () => [] as Review[])

  const spread = Math.max(1, Math.floor(reviews.length / columnCount))
  return Array.from({ length: columnCount }, (_, columnIndex) => {
    const rotated = rotateReviews(reviews, columnIndex * spread)
    return Array.from({ length: TRACK_REPEAT_COUNT }).flatMap(() => rotated)
  })
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${index < review.rating ? "fill-amber-500 text-amber-500" : "text-zinc-300"}`}
          />
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-zinc-700">"{review.message}"</p>
      <div>
        <p className="font-serif text-base font-semibold text-zinc-900">{review.name}</p>
        <p className="text-xs font-medium text-zinc-500">{review.role}</p>
      </div>
    </article>
  )
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formFeedback, setFormFeedback] = useState("")
  const columns = useMemo(() => buildColumnTracks(reviews, COLUMN_COUNT), [reviews])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Student" as "Student" | "Parent",
    rating: 5,
    message: "",
  })

  useEffect(() => {
    let isActive = true

    const loadReviews = async () => {
      try {
        setIsLoadingReviews(true)
        const response = await fetch("/api/reviews", { cache: "no-store" })
        if (!response.ok) return
        const payload = await response.json()
        const normalized = (payload.reviews as ApiReview[] | undefined)?.map((item) => ({
          id: item.id,
          name: item.full_name,
          role: item.role || "Student / Parent",
          message: item.message,
          rating: Number(item.rating ?? 5),
        })) ?? []

        if (isActive) {
          setReviews(normalized)
        }
      } catch {
        if (isActive) {
          setReviews([])
        }
      } finally {
        if (isActive) {
          setIsLoadingReviews(false)
        }
      }
    }

    loadReviews()
    return () => {
      isActive = false
    }
  }, [])

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Student",
      rating: 5,
      message: "",
    })
    setFormFeedback("")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormFeedback("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const payload = await response.json()
      if (!response.ok) {
        setFormFeedback(payload.error || "Could not submit review.")
        return
      }

      const created = payload.review
      const newReview: Review = {
        id: created.id,
        name: created.full_name,
        role: created.role || "Student / Parent",
        message: created.message,
        rating: Number(created.rating ?? 5),
      }

      setReviews((prev) => [newReview, ...prev])
      handleClear()
      setFormFeedback("Review submitted successfully.")
    } catch {
      setFormFeedback("Could not submit review.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl">
          Here is what <span className="font-serif italic">Student & Parents</span> says
        </h1>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white/80 p-3 shadow-sm sm:p-4">
        {isLoadingReviews ? (
          <div className="flex h-[420px] items-center justify-center text-zinc-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="flex h-[420px] items-center justify-center text-center text-zinc-500">
            No reviews yet. Be the first to share your experience.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((column, index) => {
              const directionClass = index % 2 === 0 ? "review-track-up" : "review-track-down"
              const duration = 52 + index * 3
              const driftDuration = 20 + index * 2
              return (
                <div key={index} className="review-column relative h-[420px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/75 p-2">
                  <div
                    className={`review-track flex flex-col gap-3 ${directionClass}`}
                    style={{
                      animationDuration: `${duration}s, ${driftDuration}s`,
                      animationDelay: `-${index * 5}s, -${index * 1.25}s`,
                    }}
                  >
                    {column.map((review, reviewIndex) => (
                      <ReviewCard key={`${review.id ?? review.name}-${reviewIndex}`} review={review} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="max-w-xl">
          <h2 className="mb-5 text-5xl font-medium text-zinc-900">
            Tell us <span className="font-serif italic">Your</span> Words
          </h2>
          <p className="text-2xl leading-relaxed text-zinc-700">
            Our academy is built on passion, dedication, and shared experiences. Your feedback helps future students and
            families understand what makes this journey special. Tell us how music has shaped your story with us.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-zinc-300 bg-white/90 p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={formData.firstName}
              onChange={(event) => handleChange("firstName", event.target.value)}
              placeholder="First name"
              className="h-11 rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
              required
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              placeholder="Last name"
              className="h-11 rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
              required
            />
          </div>

          <div className="mb-4 space-y-3">
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="Email"
              className="h-11 w-full rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
              required
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="Phone no."
              className="h-11 w-full rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={formData.role}
                onChange={(event) => handleChange("role", event.target.value as "Student" | "Parent")}
                className="h-11 rounded-xl border border-zinc-400 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
              >
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
              </select>
              <div className="flex h-11 items-center rounded-xl border border-zinc-400 bg-white px-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange("rating", value)}
                    className="p-1"
                    aria-label={`Rate ${value} stars`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        value <= formData.rating ? "fill-amber-500 text-amber-500" : "text-zinc-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <textarea
            value={formData.message}
            onChange={(event) => handleChange("message", event.target.value)}
            placeholder="Your text here"
            className="mb-4 min-h-48 w-full resize-none rounded-2xl border border-zinc-400 bg-white px-4 py-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            required
          />

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="min-w-32 rounded-xl border border-zinc-500 bg-zinc-100 px-5 py-2.5 text-lg font-medium text-zinc-800 transition hover:bg-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32 rounded-xl border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-lg font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Review Us"}
            </button>
          </div>

          {formFeedback ? <p className="mt-3 text-sm text-zinc-700">{formFeedback}</p> : null}
        </form>
      </div>

      <style jsx>{`
        .review-track {
          will-change: transform;
          backface-visibility: hidden;
        }

        .review-track-up {
          animation-name: review-scroll-up, review-drift;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }

        .review-track-down {
          animation-name: review-scroll-down, review-drift-reverse;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }

        .review-column:hover .review-track {
          animation-play-state: paused;
        }

        @keyframes review-scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-66.6667%);
          }
        }

        @keyframes review-scroll-down {
          0% {
            transform: translateY(-66.6667%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes review-drift {
          0% {
            margin-left: 0px;
          }
          50% {
            margin-left: 2px;
          }
          100% {
            margin-left: 0px;
          }
        }

        @keyframes review-drift-reverse {
          0% {
            margin-left: 2px;
          }
          50% {
            margin-left: 0px;
          }
          100% {
            margin-left: 2px;
          }
        }
      `}</style>
    </section>
  )
}
