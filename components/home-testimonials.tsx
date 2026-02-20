"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  rating: number
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function TestimonialCard({ name, role, quote, rating, distance }: TestimonialCardProps & { distance: number }) {
  const absDistance = Math.abs(distance)
  const clamped = Math.min(absDistance, 2.5)
  const rotateY = distance * -10
  const tiltTop = distance * 2
  const scale = 1 - clamped * 0.14
  const opacity = 1 - clamped * 0.3
  const zIndex = Math.round(100 - clamped * 10)

  return (
    <article
      className="h-[360px] md:h-[380px] transition-all duration-500 ease-out"
      style={{
        transform: `translateX(${distance * 12}px) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        zIndex,
      }}
    >
      <div className="h-full overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-xl">
        <div
          className="relative h-[62%] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-6 md:p-7 text-zinc-100"
          style={{ transform: `skewY(${tiltTop * 0.2}deg)` }}
        >
          <p className="pointer-events-none absolute left-5 top-4 text-4xl font-serif text-zinc-300/40">"</p>
          <p className="pointer-events-none absolute bottom-2 right-5 text-4xl font-serif text-zinc-300/40">"</p>
          <p className="pt-4 text-sm leading-relaxed md:text-[15px]">{quote}</p>
        </div>

        <div className="flex h-[38%] flex-col items-center justify-center gap-2 bg-white px-6 text-center">
          <div className="-mt-8 mb-1 grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-zinc-100 text-sm font-bold text-zinc-900 shadow-md">
            {getInitials(name)}
          </div>

          <div className="flex items-center gap-1" aria-label={`${rating} star rating`}>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-3.5 w-3.5 ${index < rating ? "fill-amber-500 text-amber-500" : "text-zinc-300"}`}
              />
            ))}
          </div>

          <p className="font-serif text-base font-semibold text-zinc-900">{name}</p>
          <p className="text-xs font-medium text-zinc-500">{role}</p>
        </div>
      </div>
    </article>
  )
}

interface HomeTestimonialsProps {
  testimonials?: TestimonialCardProps[]
}

export default function HomeTestimonials({ testimonials: customTestimonials }: HomeTestimonialsProps) {
  const defaultTestimonials: TestimonialCardProps[] = [
    {
      name: "Aarav Sharma",
      role: "Student",
      quote:
        "AMacademy transformed my musical journey. The personalized attention and expert guidance helped me discover my musical confidence.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Parent",
      quote:
        "My daughter has grown so much here. The teaching style is structured, warm, and focused on real progress every week.",
      rating: 5,
    },
    {
      name: "Rohan Singh",
      role: "Student",
      quote:
        "The best part of AMacademy is the creative freedom. I went from stage fear to enjoying performances in front of people.",
      rating: 5,
    },
    {
      name: "Sneha Gupta",
      role: "Student",
      quote:
        "These classes made learning piano feel practical and inspiring. Every lesson gives me something clear to improve.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Parent",
      quote:
        "Excellent mentoring and discipline. The instructors genuinely care and adapt to each student's pace and personality.",
      rating: 5,
    },
    {
      name: "Anjali Desai",
      role: "Student",
      quote:
        "AMacademy made music simple and fun. I now perform confidently and understand music theory much better than before.",
      rating: 5,
    },
    {
      name: "Vikram Singh",
      role: "Parent",
      quote:
        "A perfect mix of technique and creativity. My child is more confident, focused, and excited about practice every day.",
      rating: 5,
    },
  ]

  const testimonialList = useMemo(() => (customTestimonials ? customTestimonials.slice(0, 7) : defaultTestimonials), [customTestimonials])

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
      skipSnaps: false,
    },
    [autoplay.current],
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setSnapCount(emblaApi.scrollSnapList().length)
    }

    update()
    emblaApi.on("select", update)
    emblaApi.on("reInit", update)

    return () => {
      emblaApi.off("select", update)
      emblaApi.off("reInit", update)
    }
  }, [emblaApi])

  const getLoopDistance = (index: number) => {
    if (!snapCount) return 0
    let distance = index - selectedIndex
    if (distance > snapCount / 2) distance -= snapCount
    if (distance < -snapCount / 2) distance += snapCount
    return distance
  }

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
      <h2 className="mb-12 text-center font-serif text-3xl font-bold text-black sm:text-4xl md:mb-14">
        Hear from Our Students & Parents
      </h2>

      <div className="relative rounded-3xl border border-zinc-200 bg-white px-3 py-10 shadow-xl md:px-8">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 text-zinc-800 shadow-sm transition hover:bg-zinc-50 md:left-3"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 text-zinc-800 shadow-sm transition hover:bg-zinc-50 md:right-3"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch [perspective:1400px]">
            {testimonialList.map((testimonial, index) => (
              <div key={testimonial.name} className="min-w-0 flex-[0_0_82%] px-2 sm:flex-[0_0_56%] md:px-3 lg:flex-[0_0_34%]">
                <TestimonialCard {...testimonial} distance={getLoopDistance(index)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonialList.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${selectedIndex === index ? "w-8 bg-zinc-900" : "w-2 bg-zinc-300 hover:bg-zinc-500"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

