"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Session } from "@/types/auth"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { HamburgerMd as Menu, CloseMd as X } from "react-coolicons"

interface NavbarProps {
  session?: Session | null
  onLogout?: () => void
  onLoginClick?: () => void
}


export default function Navbar({ session, onLogout, onLoginClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'OCR', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Tools', href: '/tools' },
    { label: 'Hire AI Experts', href: '/hire-expert-ai-engineers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 shadow-md h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between relative">

        {/* Logo Section */}
        <div className="flex-none lg:w-[230px] flex justify-start z-20">
          <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/logo.png"
                alt="Infy Galaxy Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center leading-tight whitespace-nowrap">
              <span className="text-2xl md:text-3xl font-bold text-red-600 tracking-tight">
                InfyGalaxy
              </span>
              <div className="h-[2px] w-full bg-red-600 my-0.5" />
              <span className="text-[8px] md:text-[9px] font-medium text-red-500 tracking-[0.25em] uppercase">
                Shaping AI Tools
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-6">
          {navLinks.filter(l => l.label !== 'Blog' && l.label !== 'Contact Us').map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base xl:text-lg font-medium text-gray-700 hover:text-red-700 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/blog"
            className="text-base xl:text-lg font-medium text-gray-700 hover:text-red-700 transition-colors whitespace-nowrap"
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className="text-base xl:text-lg font-medium text-gray-700 hover:text-red-700 transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>

        {/* Auth Section (Desktop) */}
        <div className="hidden lg:flex items-center justify-end gap-3 lg:w-[230px] z-20">
          {session ? (
            <div className="flex items-center gap-3">
              {session.picture ? (
                <img
                  src={session.picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-red-500 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.name || 'User')}&background=ef4444&color=fff&size=32`;
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                  {(session.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {session.name?.split(' ')[0] || 'User'}
              </span>
              <InteractiveHoverButton
                onClick={() => onLogout?.()}
                text="Logout"
                className="px-4 py-1.5 text-sm h-8"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 xl:gap-3">
              <InteractiveHoverButton
                onClick={() => { onLoginClick?.(); }}
                text="Login"
                className="px-4 xl:px-5 py-2 text-sm h-9"
              />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button aria-label="Open navigation menu"
          className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X width={28} height={28} /> : <Menu width={28} height={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {
        mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 overflow-y-auto max-h-[80vh]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-700 hover:text-red-700 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              {session ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    {session.picture ? (
                      <img
                        src={session.picture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.name || 'User')}&background=ef4444&color=fff&size=32`;
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
                        {(session.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-700">{session.name || 'User'}</span>
                  </div>
                  <InteractiveHoverButton
                    onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}
                    text="Logout"
                    className="w-full text-center"
                  />
                </>
              ) : (
                <>
                  <InteractiveHoverButton
                    onClick={() => { onLoginClick?.(); setMobileMenuOpen(false); }}
                    text="Login"
                    className="w-full text-center"
                  />
                </>
              )}
            </div>
          </div>
        )
      }
    </nav >
  )
}
