import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import type { Metadata } from "next";
import "./sorenhale-fonts.css";
import "./sorenhale.css";
import { Header } from "@/components/sites/sorenhale/Header";
import { Footer } from "@/components/sites/sorenhale/Footer";
import { Loader, LOADER_BOOT } from "@/components/sites/sorenhale/Loader";
import { Cursor, Smooth } from "@/components/sites/sorenhale/Smooth";
import { profile, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = {
  title: ui.meta.layoutTitle,
  description: ui.meta.layoutDescription,
  icons: { icon: "/sites/sorenhale/images/0uSfFRYN0RpOnPPkTWGZ1SwNs0.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={profile.locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADER_BOOT }} />
      </head>
      <body>
        <div id="main">
          <Header />
          <Loader />
          <Smooth />
          {children}
          <Footer />
        </div>
        <Cursor />
      </body>
    </html>
  );
}
