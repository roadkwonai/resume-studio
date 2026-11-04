import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import type { Metadata } from "next";
import { byline, extras, NAME, profile } from "@/components/sites/nightly/data";
import { Shell } from "@/components/sites/nightly/Shell";
import { PRELOADER_BOOT } from "@/components/sites/nightly/preloaderBoot";
import "./globals.css";

const ogImage = extras.ogImage ?? profile.basics.aboutImage ?? profile.basics.photo;

export const metadata: Metadata = {
  title: `${NAME} · ${byline}`,
  description: profile.basics.summary,
  icons: {
    icon: [
      { url: "/sites/nightly/icons/P25SHPwdunKQgWUFjnlEz8Ju3u4.png", media: "(prefers-color-scheme: light)" },
      { url: "/sites/nightly/icons/HCOsQB2jSeCSou06Bsu95A6R29E.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/sites/nightly/icons/H6rkmFpuli5uPKXwUDw5Bio6qE.png",
  },
  openGraph: ogImage ? { images: [ogImage] } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={profile.locale} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
