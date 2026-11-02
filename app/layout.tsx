import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://havenmind-ai.vercel.app",
  ),
  title: "Haven - Nơi để đi về",
  description:
    "Nơi để nói ra điều bạn chưa nói được, và được lắng nghe. Dùng ngay trên trình duyệt, không cần tài khoản.",
  openGraph: {
    title: "Haven - Nơi để đi về",
    description:
      "Nơi để nói ra điều bạn chưa nói được, và được lắng nghe. Dùng ngay trên trình duyệt, không cần tài khoản.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning on <html>/<body> only: this guards against
    // browser extensions (Grammarly, password managers) that inject
    // attributes into the DOM before React hydrates - a well-documented,
    // unavoidable external cause, not an app bug. It does not suppress
    // mismatches anywhere else in the tree.
    <html
      lang="vi"
      className={`${newsreader.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a saved theme choice before first paint, so there's no
            flash from system-default to a stored light/dark preference.
            See lib/theme.ts for the matching client-side logic. */}
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
