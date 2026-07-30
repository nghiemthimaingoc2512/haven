import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Haven",
  description:
    "A place to say the thing you haven't said yet, and be understood, not managed.",
  openGraph: {
    title: "Haven",
    description:
      "A place to say the thing you haven't said yet, and be understood, not managed.",
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
    // attributes into the DOM before React hydrates — a well-documented,
    // unavoidable external cause, not an app bug. It does not suppress
    // mismatches anywhere else in the tree.
    <html
      lang="en"
      className={`${newsreader.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
