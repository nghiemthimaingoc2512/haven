"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile";
import { NavShell } from "@/components/NavShell";
import { NightModePrompt } from "@/components/NightModePrompt";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!profile.onboarded) router.replace("/");
  }, [profile.onboarded, router]);

  // Avoids flashing app content before the onboarding redirect resolves.
  if (!profile.onboarded) return null;

  return (
    <NavShell>
      {children}
      <NightModePrompt />
    </NavShell>
  );
}
