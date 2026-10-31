"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile";
import { useHydrated } from "@/lib/hydrated";
import { NavShell } from "@/components/NavShell";
import { NightModePrompt } from "@/components/NightModePrompt";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useProfile();
  const hydrated = useHydrated();
  const router = useRouter();

  // The profile store serves `onboarded: false` as its server snapshot, so a
  // redirect that fires before hydration would bounce every direct visit to
  // /talk, /story, ... through "/" and back to /home. Wait for the real value.
  useEffect(() => {
    if (hydrated && !profile.onboarded) router.replace("/");
  }, [hydrated, profile.onboarded, router]);

  // Avoids flashing app content before the onboarding redirect resolves.
  if (!hydrated || !profile.onboarded) return null;

  return (
    <NavShell>
      {children}
      <NightModePrompt />
    </NavShell>
  );
}
