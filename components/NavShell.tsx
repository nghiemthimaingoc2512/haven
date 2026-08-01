"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Moon } from "@/components/mascot/Moon";
import { NavUtilities } from "@/components/NavUtilities";
import { UserMenu } from "@/components/UserMenu";

interface NavItem {
  href: string;
  label: (t: ReturnType<typeof useLanguage>["t"]) => string;
  emoji: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: (t) => t.navHome, emoji: "🌙" },
  { href: "/talk", label: (t) => t.navTalk, emoji: "💬" },
  { href: "/discover", label: (t) => t.navDiscover, emoji: "✨" },
  { href: "/story", label: (t) => t.navMyStory, emoji: "🌌" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar: brand, pill nav (desktop), utilities + avatar (always visible) */}
      <header className="haven-surface sticky top-0 z-20 mx-4 mt-4 flex items-center justify-between rounded-full px-4 py-2.5">
        <Link href="/home" className="flex shrink-0 items-center gap-2 font-serif text-lg text-ink">
          <Moon size={26} animate={false} priority />
          <span className="hidden sm:inline">{t.brand}</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label={t.navAriaLabel}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-lavender text-ink"
                    : "text-muted hover:bg-line/50 hover:text-ink"
                }`}
              >
                {item.label(t)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <NavUtilities />
          <div className="h-5 w-px bg-line" aria-hidden="true" />
          <UserMenu />
        </div>
      </header>

      <main className="flex flex-1 flex-col pb-24 md:pb-0">{children}</main>

      {/* Mobile: bottom tab bar for the four main destinations only — utilities + avatar already live in the top bar */}
      <nav
        aria-label={t.navAriaLabel}
        className="haven-surface fixed inset-x-3 bottom-3 z-20 flex items-center justify-between rounded-full px-2 py-2 md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label(t)}
              className={`flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[0.65rem] transition-colors ${
                active ? "bg-lavender text-ink" : "text-muted"
              }`}
            >
              <span aria-hidden="true" className="text-lg">
                {item.emoji}
              </span>
              {item.label(t)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
