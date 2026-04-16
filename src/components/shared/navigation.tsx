"use client";

import Link from "next/link";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS, SITE_NAME, GITHUB_URL } from "@/lib/constants";
import { GithubIcon } from "./github-icon";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-borderMain">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neon">
              <Terminal className="h-4 w-4 text-charcoal" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-charcoal">
              {SITE_NAME}
            </span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-charcoalMuted hover:text-charcoal transition-colors px-3 py-2 rounded-lg"
              >
                {link.label}
              </Link>
            ))}

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-neonGhost px-3 py-2 rounded-lg text-charcoalMuted hover:text-charcoal transition-colors ml-1"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <button className="neon-btn border border-charcoal text-charcoal font-medium px-4 py-2 rounded-lg text-sm ml-2">
              <span>Subscribe</span>
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-charcoalMuted hover:text-charcoal transition-colors sm:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Section 5.2 — Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-cream transition-transform duration-300 sm:hidden",
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-borderMain">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neon">
              <Terminal className="h-4 w-4 text-charcoal" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-charcoal">
              {SITE_NAME}
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-charcoalMuted hover:text-charcoal transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-lg text-charcoalMuted hover:text-charcoal transition-colors py-4 border-b border-borderLight"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg text-charcoalMuted hover:text-charcoal transition-colors py-4 border-b border-borderLight"
          >
            <GithubIcon className="h-5 w-5" />
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
