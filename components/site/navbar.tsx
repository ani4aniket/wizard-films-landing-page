"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function Navbar({
  siteName,
  navLinks,
  navCtaLabel,
  navCtaHref,
  searchPlaceholder,
}: {
  siteName: string
  navLinks: { label: string; href: string }[]
  navCtaLabel: string
  navCtaHref: string
  searchPlaceholder: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [archiveQuery, setArchiveQuery] = useState("")

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleArchiveSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const search = archiveQuery.trim()
    if (!search) {
      router.push("/work")
      return
    }

    router.push(`/work?q=${encodeURIComponent(search)}`)
  }

  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "border-b border-transparent transition-all duration-300",
          pathname === "/" && !isScrolled
            ? "bg-transparent"
            : "bg-background/96 backdrop-blur supports-backdrop-filter:bg-background/90",
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
              {navLinks.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
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
            <form
              onSubmit={handleArchiveSearch}
              className="pill-feedback flex h-10 min-w-48 items-center rounded-full bg-secondary px-3"
            >
              <input
                type="text"
                value={archiveQuery}
                onChange={(event) => setArchiveQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search work archive"
                autoComplete="off"
                className="w-full bg-transparent px-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button type="submit" className="sr-only">
                Search
              </button>
            </form>
            <Link
              href={navCtaHref}
              className="pill-feedback inline-flex h-12 items-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground"
            >
              {navCtaLabel}
            </Link>
          </div>
          <div className="hidden gap-3 overflow-x-auto md:flex lg:hidden">
            {navLinks.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={`${item.href}-${item.label}`}
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
        <div className="mx-auto max-w-[1440px] px-6 md:hidden">
          <form
            onSubmit={handleArchiveSearch}
            className="pill-feedback mb-3 flex h-10 items-center rounded-full bg-secondary px-3"
          >
            <input
              type="text"
              value={archiveQuery}
              onChange={(event) => setArchiveQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search work archive"
              autoComplete="off"
              className="w-full bg-transparent px-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {navLinks.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={`${item.href}-${item.label}`}
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
      </nav>
    </header>
  )
}
