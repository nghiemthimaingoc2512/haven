"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { useProfile, signOut } from "@/lib/profile";

/** Circular initial-letter avatar with a Profile / Settings / Sign out dropdown - replaces the old "Me" nav tab. */
export function UserMenu() {
  const { t } = useLanguage();
  const profile = useProfile();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initial = profile.name.trim().charAt(0).toUpperCase() || "H";

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    router.push("/");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.navProfile}
        className="haven-cta flex h-9 w-9 items-center justify-center rounded-full bg-primary font-serif text-sm text-white"
      >
        {initial}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="haven-surface animate-rise absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-2xl py-1.5"
          >
            <Link
              href="/me"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-line/60"
            >
              {t.navProfile}
            </Link>
            <Link
              href="/memory"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-line/60"
            >
              {t.memoryTitle}
            </Link>
            <div className="my-1 border-t border-line" />
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="block w-full px-4 py-2.5 text-left text-sm text-muted hover:bg-line/60 hover:text-ink"
            >
              {t.navSignOut}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
