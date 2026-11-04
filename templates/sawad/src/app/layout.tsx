import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import type { Metadata } from "next";
import { Footer, Nav } from "@/components/sites/sawad/Chrome";
import { ogImage, profile, siteDescription as description, siteTitle as title } from "@/components/sites/sawad/data";
import s from "@/components/sites/sawad/sawad.module.css";
import "@/components/sites/sawad/fonts.css";
import "./globals.css";

const images = ogImage ? [ogImage] : undefined;

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/sawad/images/favicon.png" },
  openGraph: { type: "website", title, description, images },
  twitter: { card: "summary_large_image", title, description, images },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={profile.locale} style={{ background: "#151312" }}>
      <body>
        <div className={s.page}>
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
