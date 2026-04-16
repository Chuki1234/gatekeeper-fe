import Link from "next/link";
import { Terminal, Mail } from "lucide-react";
import { GithubIcon } from "./github-icon";
import { SITE_NAME, GITHUB_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-borderMain bg-white/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Row 1 */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neon">
              <Terminal className="h-4 w-4 text-charcoal" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-charcoal">
              {SITE_NAME}
            </span>
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-sm text-charcoalMuted">
              &copy; {new Date().getFullYear()} {SITE_NAME}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-charcoalMuted hover:text-charcoal transition-colors"
              >
                About
              </Link>
              <Link
                href="/api-docs"
                className="text-sm text-charcoalMuted hover:text-charcoal transition-colors"
              >
                API
              </Link>
              <a
                href={`mailto:hello@${SITE_NAME.toLowerCase()}.dev`}
                className="text-sm text-charcoalMuted hover:text-charcoal transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="mt-8 pt-6 border-t border-borderLight flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoalMuted hover:text-charcoal transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:hello@${SITE_NAME.toLowerCase()}.dev`}
              className="text-charcoalMuted hover:text-charcoal transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <span className="font-mono text-[10px] text-charcoalMuted/50 border border-borderMain px-2 py-0.5 rounded w-fit">
            v0.1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
