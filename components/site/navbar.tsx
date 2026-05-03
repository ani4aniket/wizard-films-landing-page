"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Navbar({ siteName }: { siteName: string }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-border/70 bg-background/88 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 py-5 md:px-10">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-heading text-2xl tracking-[0.18em] text-foreground uppercase"
          >
            {siteName}
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-xs tracking-[0.28em] uppercase transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-1 md:hidden">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 text-[11px] tracking-[0.28em] uppercase transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
