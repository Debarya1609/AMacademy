"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  const handleHomeClick = () => {
    closeMenu()
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" onClick={handleHomeClick} className="flex-shrink-0 transition-opacity hover:opacity-80">
            <Image
              src="/logo-black.png"
              alt="AMacademy Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" onClick={handleHomeClick} className="text-gray-700 hover:text-black transition duration-300 font-medium">
              Home
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-black transition duration-300 font-medium">
              About
            </Link>
            <Link href="/testimonials" className="text-gray-700 hover:text-black transition duration-300 font-medium">
              Reviews
            </Link>
            <Link href="/#gallery" className="text-gray-700 hover:text-black transition duration-300 font-medium">
              Gallery
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-black transition duration-300 font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/918910820366"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition duration-300"
            >
              Book a Trial
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-gray-200 transition duration-300">
              {isOpen ? (
                <X size={24} className="text-gray-700 transition-colors duration-300" />
              ) : (
                <Menu size={24} className="text-gray-700 transition-colors duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in duration-300">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded transition duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              href="/#about"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded transition duration-300 font-medium"
            >
              About
            </Link>
            <Link
              href="/testimonials"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded transition duration-300 font-medium"
            >
              Reviews
            </Link>
            <Link
              href="/#gallery"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded transition duration-300 font-medium"
            >
              Gallery
            </Link>
            <Link
              href="/#contact"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded transition duration-300 font-medium"
            >
              Contact
            </Link>
            <a
              href="https://wa.me/918910820366"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-black text-white px-4 py-2 rounded font-semibold text-center hover:opacity-80 transition duration-300"
            >
              Book a Trial
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
