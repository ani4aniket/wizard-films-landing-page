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
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "border-b border-transparent bg-background/96 transition-all duration-300",
          isScrolled && "border-border"
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="shrink-0 text-base font-medium tracking-[0.18em] text-foreground uppercase"
            >
              {siteName}
            </Link>
            <div className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "border-b-2 pb-1 text-base font-medium text-foreground transition-colors",
                      isActive
                        ? "border-foreground"
                        : "border-transparent hover:border-border hover:text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/work"
              className="pill-feedback inline-flex h-10 min-w-48 items-center rounded-full bg-secondary px-4 text-sm text-muted-foreground"
            >
              Search the archive
            </Link>
            <Link
              href="/contact"
              className="pill-feedback inline-flex h-12 items-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground"
            >
              Start a Project
            </Link>
          </div>
          <div className="hidden gap-3 overflow-x-auto md:flex lg:hidden">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] gap-3 overflow-x-auto px-6 pb-4 md:hidden">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground"
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
