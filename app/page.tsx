"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/hero"
import SocialLinks from "@/components/social-links"
import HomeTestimonials from "@/components/home-testimonials"
import Gallery from "@/components/gallery"
import MusicBackground from "@/components/music-background"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <MusicBackground />
      <div className="relative z-10">
        <Hero />
        <SocialLinks />
        <HomeTestimonials />
        <Gallery />
      </div>
    </div>
  )
}
