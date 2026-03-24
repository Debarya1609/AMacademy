"use client"

import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="relative z-30 mt-auto w-full border-t border-zinc-700/80 bg-zinc-950 py-16 px-4 text-zinc-100 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">AMacademy - All About Music</h3>
            <p className="text-zinc-200 text-sm mb-4">Piano Lessons & Music Academy in India</p>
            <a
              href="https://maps.app.goo.gl/D4d4dUUukE7qYCsP9?g_st=awb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors duration-300"
            >
              <MapPin size={20} />
              View Location on Map
            </a>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-zinc-200 hover:text-white transition-colors duration-300 font-medium">
                Home
              </Link>
              <Link href="/testimonials" className="block text-zinc-200 hover:text-white transition-colors duration-300 font-medium">
                Reviews
              </Link>
              <Link href="/#gallery" className="block text-zinc-200 hover:text-white transition-colors duration-300 font-medium">
                Gallery
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Get in Touch</h3>
            <div className="space-y-3">
              <a
                href="tel:+918910820366"
                className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors duration-300 font-medium"
              >
                <Phone size={20} />
                <span>+91 8910 8203 66</span>
              </a>
              <a
                href="mailto:amacademymusic@gmail.com"
                className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors duration-300 font-medium"
              >
                <Mail size={20} />
                <span>amacademymusic@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-700/80 pt-8">
          <p className="text-center text-zinc-300 text-sm">© 2025 AMacademy. All Rights Reserved | Crafted by BlendSpec Studio</p>
        </div>
      </div>
    </footer>
  )
}
